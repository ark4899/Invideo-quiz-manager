import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';



@Component({
  selector: 'app-quiz-viewer',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-viewer.component.html',
  styleUrl: './quiz-viewer.component.css'
})
export class QuizViewerComponent {
 firestore = inject(Firestore);
  quizzes: any[] = [];

  selectedProgramme = '';
  selectedCourseCode = '';
  selectedSemester: number | '' = '';
  selectedDate = '';

  async fetchFilteredQuizzes() {
    const quizCollection = collection(this.firestore, 'quizzes');
    let filters: any[] = [];

    if (this.selectedProgramme) filters.push(where('programme', '==', this.selectedProgramme));
    if (this.selectedCourseCode) filters.push(where('courseCode', '==', this.selectedCourseCode));
    if (this.selectedSemester) filters.push(where('semester', '==', +this.selectedSemester));
    if (this.selectedDate) filters.push(where('date', '==', this.selectedDate));

    const q = filters.length ? query(quizCollection, ...filters) : quizCollection;
    const snapshot = await getDocs(q);
    this.quizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  exportAsJson() {
    const blob = new Blob([JSON.stringify(this.quizzes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered-quizzes.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}
