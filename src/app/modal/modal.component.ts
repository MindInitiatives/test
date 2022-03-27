import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';
import { AddEditComponent } from '../users/add-edit/add-edit.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  @Input() public user:any;
  constructor(private userService:UserService,
    private alertService :AlertService,
    private _modalService: NgbModal

    ) { }

  ngOnInit(): void {
    console.log(this.user)
  }
 close(){

 }
 remove(id:number){
  this.userService.removeUser(id)
  .subscribe(
    (res)=>{
      this.alertService.success('User Deleted Successfully',{autoClose:true})
      console.log(res,'delete')
      setTimeout(()=>{
      window.location.reload()
      }, 2000)

    }, error =>{
console.log(error);

    }
  )
 }
 edit(params:any){
  const modalRef =this._modalService.open(AddEditComponent);
  modalRef.componentInstance.data = params;
 }
}
