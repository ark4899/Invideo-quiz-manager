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
import { NgForm } from '@angular/forms';
import { QuizViewerComponent } from "../quiz-viewer/quiz-viewer.component";
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';




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
    MatSelectModule,
    MatDialogModule
   
   
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
   

constructor(private dialog: MatDialog) {}

openPreviewDialog() {
  this.dialog.open(PreviewDialogComponent, {
    width: '700px',
    maxHeight: '90vh',
    data: {
      videoID: this.videoID,
      videoLocation: this.videoLocation,
      topics: this.topics
    }
  });
}
  
    // Quiz structure
    topics = [
      {
        topicName: '',
        startTime: '',
        endTime: '',
        startTimeError: '',
        endTimeError: '',
        questionSets: [
          {
            questions: [
              { que: '', options: ['', '', '', ''], correctAns: null, feedback: '' }
            ]
          }
        ]
      }
    ];
  videoDuration: number = 0;
    validateTimeFormat(time: string): boolean {
  const timePattern = /^(\d{1,2}):([0-5]?\d)(:[0-5]?\d)?$/;
  if (!timePattern.test(time)) return false;

  const [min, sec] = time.split(':').map(Number);
  return min >= 0 && sec >= 0 && sec < 60;
}

isEndTimeGreater(start: string, end: string): boolean {
  const [startMin, startSec] = start.split(':').map(Number);
  const [endMin, endSec] = end.split(':').map(Number);

  const startTotal = startMin * 60 + startSec;
  const endTotal = endMin * 60 + endSec;

  return endTotal > startTotal;
}

validateAllTimes(): boolean {
  let isValid = true;
  this.topics.forEach(topic => {
    topic.startTimeError = '';
    topic.endTimeError = '';

    if (!this.validateTimeFormat(topic.startTime)) {
      topic.startTimeError = 'Start time must be in mm:ss format';
      isValid = false;
    }

    if (!this.validateTimeFormat(topic.endTime)) {
      topic.endTimeError = 'End time must be in mm:ss format';
      isValid = false;
    }

    if (
      this.validateTimeFormat(topic.startTime) &&
      this.validateTimeFormat(topic.endTime) &&
      !this.isEndTimeGreater(topic.startTime, topic.endTime)
    ) {
      topic.endTimeError = 'End time must be greater than start time';
      isValid = false;
    }
  });
  return isValid;
}


    
  
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

    onSubmit(form: NgForm) {
  if (form.invalid) {
    alert('Please fill all mandatory fields correctly before submitting.');
    return;
  }
  this.saveQuiz();
}
  
onTimeInput(event: any, topic: any, type: 'startTime' | 'endTime') {
  const input = event.target.value;

  // Your existing formatting code here
  const clean = input.replace(/[^\d:]/g, '');
  let formatted = '';
  const parts = clean.split(':').join('').match(/.{1,2}/g);

  if (parts) {
    if (parts.length >= 3) {
      formatted = `${parts[0]}:${parts[1]}:${parts[2]}`;
    } else if (parts.length === 2) {
      formatted = `${parts[0]}:${parts[1]}`;
    } else {
      formatted = parts[0];
    }
  }

  topic[type] = formatted;

  // Validation
  if (topic.startTime && topic.endTime) {
    const start = this.convertToSeconds(topic.startTime);
    const end = this.convertToSeconds(topic.endTime);

    if (end <= start) {
      topic.endTimeError = 'End time must be greater than start time';
    } else if (end > this.videoDuration) {
      topic.endTimeError = `Entered time exceeds video duration (${this.formatSeconds(this.videoDuration)})`;
    } else {
      topic.endTimeError = '';
    }
  }
}

formatSeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return [
    hours > 0 ? String(hours).padStart(2, '0') : null,
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  ].filter(Boolean).join(':');
}





preventInvalidKey(event: KeyboardEvent) {
  const allowed = /[0-9:]/;
  if (!allowed.test(event.key)) {
    event.preventDefault();
  }
}


convertToSeconds(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

    // Add/remove quiz elements
    addTopic() {
      this.topics.push({
        topicName: '',
        startTime: '',
        endTime: '',
        startTimeError: '',
        endTimeError: '',
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