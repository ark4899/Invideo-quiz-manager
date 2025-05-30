import { Routes } from '@angular/router';
import { QuizFormComponent } from './quiz-form/quiz-form.component';
import { QuizViewerComponent } from './quiz-viewer/quiz-viewer.component';
import { PreviewDialogComponent } from './preview-dialog/preview-dialog.component';

export const routes: Routes = [

    { path: '', redirectTo: 'quiz', pathMatch: 'full' }, // Default route
    { path: 'quiz', component: QuizFormComponent }, // Route for quiz form
    { path: 'quiz-viewer', component: QuizViewerComponent }, // Route for quiz viewer
    { path: 'preview-dialog', component: PreviewDialogComponent}
];
