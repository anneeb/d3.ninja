import { BehaviorSubject, Observable } from "rxjs";

export class BaseService {
  protected getBehaviorSubjectValue<T>(
    subject: BehaviorSubject<T>
  ): Observable<T> {
    return subject.asObservable();
  }

  protected setBehaviorSubjectValue<T>(
    subject: BehaviorSubject<T>,
    value: T
  ): void {
    return subject.next(value);
  }
}
