import { makeAutoObservable } from "mobx";
class UserStore {
  
    constructor() {
        makeAutoObservable(this);
    }
    
    role = localStorage.getItem("role") || "";
    id="";
    paymentDone=false;
    hallTicketRequested=false;
    setRole(role) {
        this.role = role;
        localStorage.setItem("role", role);  
    }
    setId(id){
        this.id=id;
        localStorage.setItem("id",id);
    }
    setPaymentDone=(paymentDone)=>{
        this.paymentDone=paymentDone;
        console.log(paymentDone);
    }
    setHallTicketRequested(hallTicketRequested){
        this.hallTicketRequested=hallTicketRequested;
    }

    
}


export default UserStore;