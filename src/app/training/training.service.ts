import { Exercise } from "./exercise.model";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { UIService } from "../shared/ui.service";
//import 'rxjs/add/operator/map';
import * as Training from "./training.actions";
import * as fromTraining from "./training.reducer";
import { Store } from "@ngrx/store";

@Injectable()
export class TrainingService {
  // exerciseChanged = new Subject<Exercise>();
  // exercisesChanged = new Subject<Exercise[]>();
  // finishedExercisesChanged = new Subject<Exercise[]>();
  //private availableExercises: Exercise[] = [];
  //private selectedExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(
      this.db
        .collection("availableExercises")
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data()["name"],
                duration: doc.payload.doc.data()["duration"],
                calories: doc.payload.doc.data()["calories"],
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
            //this.availableExercises = exercises;
            //this.exercisesChanged.next([...this.availableExercises]);
          },
          (error) => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              "Fetching exercises failed, please try again later.",
              null,
              5000
            );
            //this.exercisesChanged.next(null);
            this.store.dispatch(new Training.SetAvailableTrainings(null));
          }
        )
    );
  }

  startExercise(selectedId: string) {
    // this.db
    //   .doc("availableExercises/" + selectedId)
    //   .update({ lastSelected: new Date() });
    // this.selectedExercise = this.availableExercises.find(
    //   (exercise) => exercise.id === selectedId
    // );
    // this.exerciseChanged.next({ ...this.selectedExercise });
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: "completed",
        });
        //this.selectedExercise = null;
        //this.exerciseChanged.next(null);
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          state: "canceled",
        });
        //this.selectedExercise = null;
        //this.exerciseChanged.next(null);
        this.store.dispatch(new Training.StopTraining());
      });
  }

  fetchCompletedOrCanceledExercises() {
    this.fbSubs.push(
      this.db
        .collection("finishedExercises")
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            //this.finishedExercisesChanged.next(exercises);
            this.store.dispatch(new Training.SetFinishedTrainings(exercises));
          },
          (error) => {
            console.log(error);
          }
        )
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection("finishedExercises").add(exercise);
  }
}
