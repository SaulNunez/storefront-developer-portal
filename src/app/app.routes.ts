import { Routes } from '@angular/router';
import { ApplicationCreate } from './application-create/application-create';
import { ApplicationDetails } from './application-details/application-details';
import { ApplicationEdit } from './application-edit/application-edit';
import { WindowsRelease } from './windows-release/windows-release';
import { AndroidRelease } from './android-release/android-release';
import { MacRelease } from './mac-release/mac-release';

export const routes: Routes = [
    {
        title: 'Developer Portal',
        path: '',
    },
        {
        title: 'Application Details',
        path: 'application/:applicationId',
        component: ApplicationDetails
    },
    {
        title: 'Register Application',
        path: 'application/register',
        component: ApplicationCreate
    },
    {
        title: 'Edit Application Entry',
        path: 'application/:applicationId/edit',
        component: ApplicationEdit
    },
    {
        title: 'Windows Release',
        path: 'application/:applicationId/release/windows',
        component: WindowsRelease
    },
    {
        title: 'Android Release',
        path: 'application/:applicationId/release/android',
        component: AndroidRelease
    },
    {
        title: 'Mac Release',
        path: 'application/:applicationId/release/mac',
        component: MacRelease
    }
];
