import { hash } from 'crypto';
//import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

export enum Role {
    USER = "user",
    ADMIN = "admin"
}

export class User {
    name: string;
    email: string;
    password: string;
    birthday: Date;
    profilePicture: string;
    session: string;
    role: Role;
    //resetPasswordToken: string | null;
    //resetPasswordExpires: Date | null;
    //totpSecret: string;
    //totpEnabled: boolean;


    static async comparePassword(
        password: string | Buffer,
        hash: string,
    ): Promise<boolean> {
        return compare(password, hash);
    } 

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

    static async hashPassword(pwd: string | Buffer): Promise<string> {
        return hash(pwd, argon);
        //change for whatever method is called by argon2
    }


}