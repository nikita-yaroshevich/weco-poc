import { OrganizationEntity } from './organization.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryColumn({ type: 'varchar', length: 255, unique: true })
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    username: string;

    @ManyToOne(type => OrganizationEntity, o => o.users, { nullable: true, cascade: ['remove'] })
    organization?: OrganizationEntity;

    @Column('simple-array')
    roles: string[] = [];

    @Column('simple-json', { default: {} })
    settings: any;

    @Column({ name: 'is_active', default: false })
    isActive: boolean;
}
