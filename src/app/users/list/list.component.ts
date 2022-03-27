import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/modal/modal.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  name='';
  users:any;
  currentUser =null;
  currentIndex = -1;
  page =1;
  count = 0;
  pageSize= 6;
  pageSizes = [2,4,6];
  constructor(
    private userService : UserService,
    private _modalService: NgbModal

  ) { }

  ngOnInit(): void {
    this.retrieveusers()
  }
  getRequestParams(searchTitle:any, page:any,pageSize:any):any {
    let params:any={}
    if(searchTitle){
      params[`name`] = searchTitle;
    }
    if(page){
      params[`page`] = page ;
    }
    if(pageSize){
      params[`size`] = pageSize
    }
    return params

  }
  retrieveusers(){
 const params = this.getRequestParams(this.name,this.page,this.pageSize);
    this.userService.getUsers(params)
    .subscribe((
      response) =>{
        const {data, total, } =response;
       
        
        this.users = data;
        this.count = total;
        console.log(this.users, 'page');
        
        
        console.log(response)
      }
    )
  }
  handlePageChange(event:any){
    this.page = event
    console.log(event)
    this.retrieveusers();

  }
  handlePageSizeChange(event:any):void{
    this.pageSize = event.target.value;
    
    this.retrieveusers()
  }
  userDetails(id:number){
    this.userService.getUsersById(id)
    .subscribe((res)=>{
      const {data}=res
      const modalRef = this._modalService.open(ModalComponent);
modalRef.componentInstance.user = data;

    })
  }
}
