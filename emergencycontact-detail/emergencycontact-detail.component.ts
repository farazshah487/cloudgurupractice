import { Component, OnInit,ViewChild, ViewEncapsulation } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router,ActivatedRoute  } from '@angular/router';
import {FetchData } from 'app/shared/generalMethods';

import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParentPortalService } from '../../../services/parentPortal.service';

@Component({
    selector     : 'emergencycontact-detail',
    templateUrl  : './emergencycontact-detail.component.html',
    styleUrls: ['./emergencycontact-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class EmergencyContactDetailComponent implements OnInit
{
    @ViewChild('emergencyContactNgForm') emergencyContactNgForm: NgForm;
    profileForm: FormGroup;
    userRecord: any;
    pageLoader: any;
    pageLoaderText: any;
    recordId = null;
    emergencyRecord = null;
    updateBtn = true;
    apiResult: any;
    emergencyId = null;
    parentId = null;

    /**
     * Constructor
     */
     constructor(
        private _formBuilder: FormBuilder,
        private _parentPortalService: ParentPortalService,
        private _fetchData: FetchData,
        private _snackBar: MatSnackBar,
        private router: ActivatedRoute,
        private _router: Router,
        private routers: Router)
    {
        /*
        this.emergencyRecord =  this._fetchData.data.lstEmergencyContacts[0];
        this.userRecord =  this._fetchData.data.lstParents[0];
        if(this.emergencyRecord){
            console.log(this.emergencyRecord);
            console.log(this.emergencyRecord.Id);
            console.log(this._fetchData.data.lstEmergencyContacts);
            console.log(this._fetchData.data.lstEmergencyContacts[0].id);
            this.emergencyId = this.emergencyRecord.Id;
            this.parentId = this._fetchData.parentId;
        }
        else{
            // console.log('Parent not found');
        }
        */
    }

    ngOnInit(): void
    {
        this.userRecord =  this._fetchData.data;
        //console.log(this.userRecord);
        this.parentId = this.userRecord.parentId; //this.userRecord.lstParents[0].Id;
        //console.log(this.parentId);
        // this.parentId = userRecord.lstParents[0].Name;
        this.router.queryParams.subscribe((params) => {
            this.recordId = params['id'];
        });
        if(this.userRecord){
            this.getEmergencyDetail(this.recordId);
        }
        else{
            this.routers.navigateByUrl('/example');
        }
    }


    getEmergencyDetail(recordId): void{
        this.userRecord.lstEmergencyContacts.forEach((element) => {
            if(element.Id === recordId){
                //console.log(element);

                this.emergencyRecord = element;
                this.emergencyId = this.emergencyRecord.Id;
                this.setFormValues(this.emergencyRecord);

            }
        });
    }


    setFormValues(response): void{
        this.profileForm = this._formBuilder.group({
            parentName : [this.userRecord.lstParents[0].Name],
            id: [{value:response.Name,disabled: true},[Validators.required]],
            contactName: [response.contactName__c === 'null' ? '' : response.contactName__c,[Validators.required] ],
            canPickChild: [response.canPickChild__c === 'null' ? 'false' : response.canPickChild__c,[Validators.required] ],
            physicalAddress: [response.Physical_Address__c === 'null' ? '' : response.Physical_Address__c,[Validators.required] ],
            city: [response.Town_City__c === 'null' ? '' : response.Town_City__c,[Validators.required] ],
            postalCode: [response.Postal_Code__c === 'null' ? '' : response.Postal_Code__c,[Validators.required] ],
            homePhone: [response.Home_Phone__c === 'null' ? '' : response.Home_Phone__c ,[Validators.required]],
            cellPhone: [response.Cell_Phone__c === 'null' ? '' : response.Cell_Phone__c],
            workPhone: [response.Work_Phone__c === 'null' ? '' : response.Work_Phone__c ],
        });
        console.log(this.profileForm);
    }

    clickEdit(): void{
        this.pageLoader = false;
        this.updateBtn = false;
        // this.profileForm.get('parenIdOrUid').enable();
        this.profileForm.get('contactName').enable();
        this.profileForm.get('canPickChild').enable();
        this.profileForm.get('physicalAddress').enable();
        this.profileForm.get('city').enable();
        this.profileForm.get('postalCode').enable();
        this.profileForm.get('homePhone').enable();
        this.profileForm.get('cellPhone').enable();
        this.profileForm.get('workPhone').enable();
}

disabledField(): void{
    this.updateBtn = true;
    // this.profileForm.get('parenIdOrUid').disable();
    this.profileForm.get('contactName').disable();
    this.profileForm.get('canPickChild').disable();
    this.profileForm.get('physicalAddress').disable();
    this.profileForm.get('city').disable();
    this.profileForm.get('postalCode').disable();
    this.profileForm.get('homePhone').disable();
    this.profileForm.get('cellPhone').disable();
    this.profileForm.get('workPhone').disable();
}

onFormSubmit(): void {
    this.pageLoader = true;
    this.pageLoaderText = this._fetchData.data.lstAppSettings[0].Loading_message__c;
    const formData = this.profileForm;
    if (formData.valid) {
        //console.log(this.profileForm.value);
        //console.log(this.parentId);
        //console.log(this.emergencyId);
            this._parentPortalService.updateEmergencyContact(this.profileForm.value,this.parentId, this.emergencyId).subscribe(
                (response) => {
                    //console.log(response);
                    this.apiResult = this._fetchData.parseIntoJSON(response.msg);
                    this._fetchData.setLocalStorage(response.msg);
                    if(this.apiResult.success === true){
                        this.pageLoader = false;
                        this.disabledField();
                        this.openSnackBar('Record has been updated successfully.');
                        this._router.navigate(['all-membership']);
                    }
                    else{
                        this.updateBtn = false;
                        this.pageLoader = false;
                        this.openSnackBar(this.apiResult.error.message);
                    }
                },
                (err) => {
                    this.updateBtn = false;
                    this.pageLoader = false;
                    this.pageLoaderText = 'Please try again, record not saved.';
                    this.openSnackBar(this.apiResult.error.message);
                    // console.log(err);
                },
            );
        }
    else{
        this.pageLoader = false;
        this.updateBtn = false;
        this.pageLoaderText = 'Please fill in all the required fields.';
    }

}
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    openSnackBar(message: string) {
        this._snackBar.open(message, 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
            });
        }

    healthInfoPage(): void{
        this.routers.navigate(['/add-healthInformation/'],{ queryParams: { id: this.emergencyRecord.Id } });
    }

}
