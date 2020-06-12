import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { ToTypeTransformer } from '../transformers';
import { ToPlainTransformer } from '../transformers/ToPlainTransformer';

export interface ValidationPipeOptions extends ValidatorOptions {
    transform?: boolean;
    disableErrorMessages?: boolean;
}

let classValidator: any;
// let classTransformer: any = {};

export class RequestValidationPipe implements PipeTransform<any> {
    protected isTransformEnabled: boolean;
    protected isDetailedOutputDisabled?: boolean;
    protected validatorOptions: ValidatorOptions;

    constructor(options?: ValidationPipeOptions) {
        options = options || {};
        const { transform, disableErrorMessages, ...validatorOptions } = options;
        this.isTransformEnabled = !!transform;
        this.validatorOptions = validatorOptions;
        this.isDetailedOutputDisabled = disableErrorMessages;

        const loadPkg = pkg => loadPackage(pkg, 'RequestValidationPipe');
        classValidator = loadPkg('class-validator');
        // classTransformer = loadPkg('class-transformer');
    }

    public async transform(value, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metadata)) {
            return value;
        }
        const entity = new ToTypeTransformer(metatype).transform(this.toEmptyIfNil(value));
        const errors = await classValidator.validate(entity, this.validatorOptions);
        if (errors.length > 0) {
            throw new BadRequestException(this.isDetailedOutputDisabled ? undefined : errors);
        }
        return this.isTransformEnabled ? entity : Object.keys(this.validatorOptions).length > 0 ? new ToPlainTransformer().transform(entity) : value;
    }

    private toValidate(metadata: ArgumentMetadata): boolean {
        const { metatype, type } = metadata;
        if (type === 'custom') {
            return false;
        }
        const types = [String, Boolean, Number, Array, Object];
        return !types.some(t => metatype === t) && !isNil(metatype);
    }

    toEmptyIfNil<T = any, R = any>(value: T): R | {} {
        return isNil(value) ? {} : value;
    }
}
