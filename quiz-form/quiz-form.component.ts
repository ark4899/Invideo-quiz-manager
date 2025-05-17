import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { Timestamp } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';




@Component({
  selector: 'app-quiz-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule,
    MatSelectModule
  ],
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.css']
})
export class QuizFormComponent {
 
    // Inject services
    firestore = inject(Firestore);
    sanitizer = inject(DomSanitizer);
  
    // Fields
    videoID: string = '';
    videoLocation: string = '';
    videoPreview: SafeResourceUrl = '';
    showPreview: boolean = false;
    programmeOptions = ['BBA', 'MBA', 'BCA', 'MCA', 'BCOM', 'CPHAHM', 'CPDM']; // or any other valid list
    programme: string = '';
    
    semesterOptions = [1, 2, 3, 4, 5, 6, 7, 8];
    semester: number | null = null;
    
    

    courseCode: string = '';
    courseTitle: string = '';
   

  
    // Quiz structure
    topics = [
      {
        topicName: '',
        startTime: '',
        endTime: '',
        questionSets: [
          {
            questions: [
              { que: '', options: ['', '', '', ''], correctAns: null, feedback: '' }
            ]
          }
        ]
      }
    ];
  
    // Video preview logic
    updateVideoPreview() {
      this.videoPreview = this.videoID
        ? this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.videoID}`)
        : '';
    }
  
    // Preview toggle
    togglePreview() {
      this.showPreview = !this.showPreview;
    }
  
    // Add/remove quiz elements
    addTopic() {
      this.topics.push({
        topicName: '',
        startTime: '',
        endTime: '',
        questionSets: [
          {
            questions: [
              { que: '', options: ['', '', '', ''], correctAns: null, feedback: '' }
            ]
          }
        ]
      });
    }
  
    removeTopic(index: number) {
      this.topics.splice(index, 1);
    }
  
    addQuestionSet(topic: any) {
      topic.questionSets.push({
        questions: [{ que: '', options: ['', '', '', ''], correctAns: null, feedback: '' }]
      });
    }
  
    removeQuestionSet(topic: any, index: number) {
      topic.questionSets.splice(index, 1);
    }
  
    addQuestion(set: any) {
      set.questions.push({ que: '', options: ['', '', '', ''], correctAns: null, feedback: '' });
    }
  
    removeQuestion(set: any, index: number) {
      set.questions.splice(index, 1);
    }
  
    addOption(question: any) {
      if (!question.options) {
        question.options = [];
      }
      question.options.push('');
    }
  
    removeOption(question: any, index: number) {
      if (question.options.length > 2) {
        question.options.splice(index, 1);
      } else {
        alert('At least two options are required.');
      }
    }
  
    trackByIndex(index: number): number {
      return index;
    }
  
    // Save to Firestore
    async saveQuiz() {
      try {
        const quizCollection = collection(this.firestore, 'quizzes');
        await addDoc(quizCollection, {
          programme: this.programme,
          semester:this.semester,
          courseCode: this.courseCode,
          courseTitle: this.courseTitle,
          videoID: this.videoID,
          videoLocation: this.videoLocation,
          topics: this.topics,
          submittedAt: Timestamp.now()
        });
        alert('✅ Quiz saved successfully!');
      } catch (error) {
        console.error('Error saving quiz:', error);
        alert('Error saving quiz. Check console.');
      }
      
    }
    // Method to export quiz data as JSON file
exportQuizAsJSON() {
  const quizData = {
    videoID: this.videoID,
    videoLocation: this.videoLocation,
    topics: this.topics
  };

  const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'quiz-data.json';  // Specify the file name
  link.click();
}

  }
//   constructor(@Inject(Firestore) private firestore: Firestore) {}


  

//   async saveQuiz() {
//     try {
//       const quizCollection = collection(this.firestore, 'quizzes');
//       await addDoc(quizCollection, {
//         videoID: this.videoID,
//         videoLocation: this.videoLocation,
//         topics: this.topics
//       });
//       alert('Quiz saved successfully!');
//     } catch (error) {
//       console.error('Error saving quiz:', error);
//     }
//   }

//   fetchQuizzes() {
//     try {
//       const quizCollection = collection(this.firestore, 'quizzes');
//       this.quizzes$ = collectionData(quizCollection, { idField: 'id' }); // Fetch data as observable
//     } catch (error) {
//       console.error('Error fetching quizzes:', error);
//     }
//   }

//   ngOnInit() {
//     this.fetchQuizzes(); // Fetch quizzes when component loads
//   }
// }