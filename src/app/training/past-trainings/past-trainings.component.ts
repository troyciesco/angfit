import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Exercise } from "../exercise.model";
import { TrainingService } from "../training.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import * as fromTraining from "../training.reducer";

@Component({
  selector: "app-past-trainings",
  templateUrl: "./past-trainings.component.html",
  styleUrls: ["./past-trainings.component.css"],
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  // displayedColumns = ["date", "name", "duration", "calories", "state"];
  displayedColumns = ["name", "duration", "calories", "state"];
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private trainingSevice: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit(): void {
    this.store
      .select(fromTraining.getFinishedExercises)
      .subscribe((exercises: Exercise[]) => {
        this.dataSource.data = exercises;
      });
    this.trainingSevice.fetchCompletedOrCanceledExercises();
    // this.exChangedSubscription = this.trainingSevice.finishedExercisesChanged.subscribe(
    //   (exercises: Exercise[]) => {
    //     this.dataSource.data = exercises;
    //   }
    // );
  }

  // ngOnDestroy() {
  //   this.exChangedSubscription.unsubscribe();
  // }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
