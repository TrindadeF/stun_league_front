import { Component, OnInit } from '@angular/core';
import { PlanService, Plan } from '../../services/plan.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css'],
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
