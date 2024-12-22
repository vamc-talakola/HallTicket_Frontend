import { makeAutoObservable } from "mobx";
class UserStore {
    role = localStorage.getItem("role") || "";
    constructor() {
        makeAutoObservable(this);
    }
    setRole(role) {
        this.role = role;
        localStorage.setItem("role", role);  
    }
    
}


const  userStore=new UserStore();
export default userStore;