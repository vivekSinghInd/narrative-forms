import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NarrativeFormComponent } from './narrative-form.component';

describe('NarrativeFormComponent', () => {
  let component: NarrativeFormComponent;
  let fixture: ComponentFixture<NarrativeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NarrativeFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NarrativeFormComponent);
    component = fixture.componentInstance;
    component.config = {
      form: { id: 'test', name: 'Test', version: 1 },
      fields: [{ key: 'name', type: 'text', prefix: 'Name:' }]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render fields if no welcome screen', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.ns-fields')).toBeTruthy();
  });
});
