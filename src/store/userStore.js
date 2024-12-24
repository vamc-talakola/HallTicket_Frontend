import { makeAutoObservable } from "mobx";
class UserStore {
    role = localStorage.getItem("role") || "";
    id="";
    constructor() {
        makeAutoObservable(this);
    }
    setRole(role) {
        this.role = role;
        localStorage.setItem("role", role);  
    }
    setId(id){
        this.id=id;
        localStorage.setItem("id",id);
    }
    
}


const  userStore=new UserStore();
export default userStore;