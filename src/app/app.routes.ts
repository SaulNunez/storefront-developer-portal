import { Routes } from '@angular/router';
import { ApplicationCreate } from './application-create/application-create';
import { ApplicationDetails } from './application-details/application-details';
import { ApplicationEdit } from './application-edit/application-edit';
import { ReleaseCreate } from './release-create/release-create';
import { ReleaseDetails } from './release-details/release-details';
import { ApplicationList } from './application-list/application-list';

export const routes: Routes = [
    {
        title: 'Developer Portal',
        path: '',
        component: ApplicationList
    },
        {
        title: 'Register Application',
        path: 'application/register',
        component: ApplicationCreate
    },
        {
        title: 'Application Details',
        path: 'application/:applicationId',
        component: ApplicationDetails
    },
    {
        title: 'Edit Application Entry',
        path: 'application/:applicationId/edit',
        component: ApplicationEdit
    },
    {
        title: 'New Release',
        path: 'application/:applicationId/release/:platform',
        component: ReleaseCreate
    },
    {
        title: 'Release',
        path: 'application/:applicationId/release/:platform/:releaseId',
        component: ReleaseDetails
    }
];
