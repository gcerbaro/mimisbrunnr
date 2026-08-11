import { CoreEntity } from '../../core.entity';
import { Column, Entity } from 'typeorm';
import { verify, hash, argon2id } from "argon2";

export enum Role {
    USER = "user",
    ADMIN = "admin"
}

@Entity()
export class User extends CoreEntity {
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 60, select: false })
    password: string;

    @Column({ type: 'date' })
    birthday: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profilePicture: string;

    @Column({
        type: 'simple-enum',
        enum: Role,
        default: Role.USER
    })
    role: Role;

    //@Column({type: 'varchar', nullable: true})
    //resetPasswordToken: string | null;
    //@Column({type: 'timestamp', nullable: true})
    //resetPasswordExpires: Date | null;
    //@Column({type: 'varchar', nullable: true})
    //totpSecret: string;
    //@Column({type: 'boolean', default: false})
    //totpEnabled: boolean;

    async comparePassword(pwd: string | Buffer): Promise<boolean> {
        let hash = this.password;

        if (!hash) {
            hash = (
                await User.findOneOrFail({
                    where: { id: this.id },
                    select: {
                        password: true,
                    },
                })
            ).password;
        }

        return User.comparePassword(pwd, hash);
    }

    static async comparePassword(
        password: string | Buffer,
        hash: string,
    ): Promise<boolean> {
        return verify(hash, password);
    }

    static async hashPassword(pwd: string | Buffer): Promise<string> {
        return await hash(pwd, {
            type: argon2id,
            timeCost: 4,
            parallelism: 4,
            memoryCost: 65536,
            hashLength: 64
        });
    }

    static async findByEmailAndPassword(email: string,
        password: string,
        includeDeleted=false):Promise<User | null>{
        let qb = this.createQueryBuilder('user');

        if(includeDeleted){
            qb.withDeleted();
        }

        const user = await qb
        .select('*')
        .where('user.email = :email', {email})
        .getRawOne()
        .then((data: object | null) => data ? User.create({...data}): null);

        if(!user){
            return null;
        }

        if(!(await this.comparePassword(password, user.password))){
            return null;
        }
        return User.create({
            ...user,
            password: undefined,
        });
    }

}