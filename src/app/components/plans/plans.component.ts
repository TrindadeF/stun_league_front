import { Component, OnInit } from '@angular/core';
import { PlanService, Plan } from '../../services/plan.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-plans',
  standalone: true,
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css'],
  imports: [SidebarComponent],
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  selectedPlan?: Plan;

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.planService.getPlans().subscribe((data) => {
      this.plans = data;
    });
  }

  selectPlan(name: string): void {
    this.planService.getPlanByName(name).subscribe((plan) => {
      this.selectedPlan = plan;
    });
  }
}
