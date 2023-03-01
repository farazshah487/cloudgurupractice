import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { AddHealthInformationComponent } from 'app/modules/admin/add-healthInformation/add-healthInformation.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const addhealthinforamtionRoutes: Route[] = [
    {
        path     : '',
        component: AddHealthInformationComponent
    }
];

@NgModule({
    declarations: [
        AddHealthInformationComponent
    ],
    imports     : [
        RouterModule.forChild(addhealthinforamtionRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule
    ]
})
export class AddHealthInformationModule
{
}
