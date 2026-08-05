import { Role, User } from "../modules/user/model/user.entity";

export const isAuthorized = (
    user: User,
    roles: Role | Role[]
): boolean =>{
    if(Array.isArray(roles) && !roles.length){
        //No roles specified, allow access
        return true;
    }

    const roleSet = new Set(Array.isArray(roles) ? roles : [roles]);
    let role: Role | null = user.role;

    while(role){
        if(roleSet.has(role)){
            return true;
        }

    }

    return false;
};