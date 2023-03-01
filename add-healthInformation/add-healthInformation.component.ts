import { Component, OnInit,ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParentPortalService } from '../../../services/parentPortal.service';
import {MatSnackBar ,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { Router, NavigationExtras,ActivatedRoute, ParamMap  } from '@angular/router';
import * as moment from 'moment';
import {FetchData } from 'app/shared/generalMethods';
@Component({
    selector     : 'add-healthInformation',
    templateUrl  : './add-healthInformation.component.html',
    styleUrls: ['./add-healthInformation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddHealthInformationComponent implements OnInit
{
    @ViewChild('addChildrenHealthNgForm') addChildrenNgForm: NgForm;
    addChildrenHealthForm: FormGroup;
    pageLoader: any;
    userRecord: any;
    pageLoaderText: any;
    recordId = null;
    parentId = null;


    /**
     * Constructor
     */
    constructor(
        private _fetchData: FetchData,
        private _formBuilder: FormBuilder,
        private _parentPortalService: ParentPortalService,
        private _snackBar: MatSnackBar,
        private router: ActivatedRoute,
        private routers: Router)
    {
        this.router.queryParams.subscribe((params) => {
            this.recordId = params['id'];
            // console.log(this.recordId);
        });
        this.userRecord =  this._fetchData.data;
        this.parentId = this._fetchData.parentId;
    }

    ngOnInit(): void
    {
        this.addChildrenHealthForm = this._formBuilder.group({
                healthCard: [''],
                immunizations: ['',[Validators.required]],
                allergies: ['',[Validators.required]],
                disability: [''],
                medication: [''],
                anyOtherConcerns: [''],
        });
    }


    onFormSubmit(): void {
        if (this.addChildrenHealthForm.valid) {
            this.pageLoader = true;
            this.pageLoaderText = this._fetchData.data.lstAppSettings[0].Loading_message__c;
                this._parentPortalService.addChildHealthInformation(this.addChildrenHealthForm.value,this.recordId,this.parentId).subscribe(
                    (response) => {
                        this.pageLoader = false;
                        this._fetchData.setLocalStorage(response.msg);
                        this.openSnackBar('Record is added successfully.');
                        this.routers.navigate(['/all-membership']);

                    },
                    (err) => {
                        this.pageLoader = false;
                        // console.log(err);
                    },
                );}
        else{
            this.pageLoader = false;
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

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
        }

}
