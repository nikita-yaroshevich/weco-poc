import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from './user.entity';

@Entity({name: 'organizations'})
export class OrganizationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 255, unique: true})
    name: string;

    @Column({type: 'varchar', length: 255, unique: true})
    type: string;

    @OneToOne(type => UserEntity, {cascade: ['remove']})
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @OneToMany(type => UserEntity, user => user.organization)
    users: UserEntity[];
}
