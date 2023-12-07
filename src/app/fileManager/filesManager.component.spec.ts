import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesManagerContainerComponent } from './filesManager.component';

describe('FilesManagerContainerComponent', () => {
  let component: FilesManagerContainerComponent;
  let fixture: ComponentFixture<FilesManagerContainerComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(FilesManagerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
