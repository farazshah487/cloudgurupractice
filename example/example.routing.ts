import { Route } from '@angular/router';
import { ExampleComponent } from './example.component';
import { ProjectResolver } from './example.resolvers';

export const projectRoutes: Route[] = [
    {
        path     : '',
        component: ExampleComponent,
        resolve  : {
            data: ProjectResolver
        }
    }
];
