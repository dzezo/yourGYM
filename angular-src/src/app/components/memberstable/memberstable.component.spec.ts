/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MemberstableComponent } from './memberstable.component';

describe('MemberstableComponent', () => {
  let component: MemberstableComponent;
  let fixture: ComponentFixture<MemberstableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberstableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
