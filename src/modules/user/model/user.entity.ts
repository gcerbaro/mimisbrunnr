import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import {Exclude} from 'class-transformer';
//import {SaltRounds} from 'env';
import  {verify, hash} from "argon2";

export enum Role {
    USER = "user",
    ADMIN = "admin"
}

@Entity()
export class User {
    @Column({type: 'varchar', length: 100})
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 60, select: false })
    password: string;

    @Column({type: 'timestamp'})
    birthday: Date;

    @Column({type: 'varchar', length: 255})
    profilePicture: string;

    session: string;

    @Column({
        type: 'enum',
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

    async comparePassword(pwd: string | Buffer): Promise<Boolean> {
        let hash = this.password;

        if (!hash) {
            hash = await User.findOneOrFail({
                where: { id: this.id },
                select: ['id', 'password']
            }).then((user) => user.password)
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
        return await hash(pwd);
    }


}