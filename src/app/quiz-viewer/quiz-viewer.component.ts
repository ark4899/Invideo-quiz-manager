import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { formatDate } from '@angular/common';
import { doc, updateDoc } from '@angular/fire/firestore';



@Component({
  selector: 'app-quiz-viewer',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSelectModule, MatButtonModule, FormsModule],
  templateUrl: './quiz-viewer.component.html',
  styleUrls: ['./quiz-viewer.component.css']
})
export class QuizViewerComponent {
  firestore = inject(Firestore);
   currentUserName = 'Anonymous';
  quizzes$ = collectionData(collection(this.firestore, 'quizzes'), { idField: 'id' }).pipe(
    map(data => data as any[])
  );

  filteredQuizzes: any[] = [];
  allQuizzes: any[] = [];

  programmeOptions: string[] = [];
  semesterOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  courseCodeOptions: string[] = [];

  selectedProgramme = '';
  selectedSemester: number | null = null;
  selectedCourseCode = '';

  displayedColumns = ['programme', 'courseCode', 'title', 'semester', 'date', 'remark', 'actions'];
constructor() {
  this.quizzes$.subscribe(data => {
    // Convert Firestore Timestamp to JS Date for each quiz
    this.allQuizzes = data.map(q => ({
      ...q,
      submittedAt: q.submittedAt && q.submittedAt.toDate ? q.submittedAt.toDate() : q.submittedAt
    }));
    this.updateFilterOptions();
    this.applyFilters();
  });
}

updateRemark(quizId: string, newRemark: string): void {
  const quizDocRef = doc(this.firestore, 'quizzes', quizId);
  updateDoc(quizDocRef, {
    remark: newRemark,
    remarkBy: this.currentUserName // Set this to the logged-in user's name or email
  })
    .then(() => console.log('Remark updated'))
    .catch((error) => console.error('Error updating remark:', error));
}

  updateFilterOptions() {
    this.programmeOptions = [...new Set(this.allQuizzes.map(q => q.programme))];
    this.courseCodeOptions = [...new Set(this.allQuizzes.map(q => q.courseCode))];
  }

  applyFilters() {
    this.filteredQuizzes = this.allQuizzes.filter(q => {
      return (!this.selectedProgramme || q.programme === this.selectedProgramme) &&
             (!this.selectedSemester || q.semester === this.selectedSemester) &&
             (!this.selectedCourseCode || q.courseCode === this.selectedCourseCode);
    });
  }

  clearFilters() {
    this.selectedProgramme = '';
    this.selectedSemester = null;
    this.selectedCourseCode = '';
    this.applyFilters();
  }

  exportAsJSON(quiz: any) {
      let formattedDate = '';
  if (quiz.date) {
    let dateObj = quiz.date instanceof Timestamp ? quiz.date.toDate() : new Date(quiz.date);
    formattedDate = formatDate(dateObj, 'dd-MM-yyyy', 'en-IN', 'Asia/Kolkata');
  }
    const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${quiz.courseCode}_${quiz.date || 'quiz'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
