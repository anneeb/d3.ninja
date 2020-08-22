import { BehaviorSubject, Observable } from "rxjs";

export class BehaviorSubjectWrapper<T> {
  private value: BehaviorSubject<T>;

  constructor(value: T) {
    this.value = new BehaviorSubject<T>(value);
  }

  public getValue(): Observable<T> {
    return this.value.asObservable();
  }

  public setValue(value: T): void {
    this.value.next(value);
  }
}
