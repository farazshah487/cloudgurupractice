import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { ModalDashboardComponent } from '../modal-dashboard/modal-dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { FetchData } from 'app/shared/generalMethods';

interface Article {
    kid: string;
    Date__c: string;
    date: Date;
}
@Component({
    selector: 'dashboard',
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ExampleComponent implements OnInit {
    userRecord = null;
    data: any;
    userName: any;
    profile: any;
    classScheduleId = [];
    registrationSchedule = [];
    registrationScheduleComingSoon = [];
    registrationScheduleComingSoon2 = [];
    showToday = true;
    newChildName: any;

    constructor(public dialog: MatDialog, private _fetchData: FetchData) {
        this.userRecord = this._fetchData;
        this.classScheduleId = [];
        this.registrationSchedule = [];
        this.registrationScheduleComingSoon = [];
        this.registrationScheduleComingSoon2 = [];
    }

    ngOnInit(): void {
        if (this.checkAccountValidity) {
            this.populateRegistrationSchedules();
        }
    }

    checkAccountValidity(): boolean {
        return this.userRecord.hasValidExternalAccount && !this.userRecord.accountBlocked;
    }

    populateRegistrationSchedules(): void {
        const programRegistrations = this.userRecord.data.lstProgramRegistrations;
        const registrationSchedules = this.userRecord.data.lstRegistrationSchedules;
        const classSchedules = this.userRecord.data.lstClassSchedules;

        programRegistrations.forEach((programRegistration) => {
            registrationSchedules.forEach((registrationSchedule) => {
                if (programRegistration.Id === registrationSchedule.Program_Registration__c && registrationSchedule.Is_Waiting__c === false) {
                    for (const item of classSchedules) {
                        if (item.Id === registrationSchedule.Class_Schedule__c) {
                            this.processClassSchedule(registrationSchedule, item);
                        }
                    }
                }
            });
        });

        this.sortByDateName(this.registrationScheduleComingSoon);

        if (this.classScheduleId.length === 0) {
            this.showToday = this.registrationScheduleComingSoon.length > 0 ? false : true;
        }
    }

    processClassSchedule(registrationSchedule: any, csItem: any): void {
        const sDate = csItem.Date__c + 'T' + csItem.Start_Time__c;
        const csDates = moment(sDate).isValid() ? moment(sDate).utc().format('h:mm A') : csItem.Start_Time__c;
        const kidName = registrationSchedule.Kid_name__c;

        if (csItem.Date__c === moment().format('YYYY-MM-DD')) {
            this.addClassScheduleToday(csItem, csDates, kidName);
        } else {
            this.addRegistrationScheduleComingSoon(csItem, kidName);
        }
    }

    addClassScheduleToday(csItem: any, csDates: any, kidName: any): void {
        const objDashboardToday = {
            Date__c: csItem.Date__c,
            startTime: csDates,
            Name: csItem.Name,
            Program_Location__c: csItem.Program_Location__c,
            kid: kidName,
            Notes__c: this.userRecord.data.lstClassSchedules.Notes__c,
        };
        this.classScheduleId.push(objDashboardToday);
    }

    addRegistrationScheduleComingSoon(csItem: any, kidName: any): void {
        const sDate = csItem.Date__c + 'T' + csItem.Start_Time__c;
        const csStartTime = moment(sDate).isValid() ? moment(sDate).utc().format('h:mm A') : csItem.Start_Time__c;

        const objDashboardUpComing = {
            Date__c: csItem.Date__c,
            startTime: csStartTime,
            Name: csItem.Name,
            Program_Location__c: csItem.Program_Location__c,
            kid: kidName,
            Notes__c: csItem.Notes__c,
            date: new Date(csItem.Date__c),
        };
        this.registrationScheduleComingSoon.push(objDashboardUpComing);
    }

    sortByDateName(articles: Article[]): Article[] {
        const parsedArticles = articles.map((article) => ({
            ...article,
            date: new Date(article.Date__c),
        }));
        const sortedArticles = parsedArticles.sort((a, b) => a.date.getTime() - b.date.getTime() || a.kid.localeCompare(b.kid));
        return sortedArticles;
    }

    openDialog = (e): void => {
        this.dialog.open(ModalDashboardComponent, {
            height: 'auto',
            width: 'auto',
            maxWidth: '750px',
            data: {
                record: e,
            },
        });
    };

    todayData = (): void => {
        this.showToday = true;
    };

    tomorrowData = (): void => {
        this.showToday = false;
    };
}
