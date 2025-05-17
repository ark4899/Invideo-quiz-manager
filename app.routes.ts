import { Routes } from '@angular/router';
import { QuizFormComponent } from './quiz-form/quiz-form.component';
import { QuizViewerComponent } from './quiz-viewer/quiz-viewer.component';

export const routes: Routes = [

    { path: '', redirectTo: 'quiz', pathMatch: 'full' }, // Default route
    { path: 'quiz', component: QuizFormComponent }, // Route for quiz form
    {path: 'quiz-viewer', component: QuizViewerComponent }, // Route for quiz viewer
];
