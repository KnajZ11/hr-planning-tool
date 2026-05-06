//src/components/App.ts
import { MonthSelector } from './MonthSelector';
import { EmployeeList } from './EmployeeList';
import { ProjectList } from './ProjectList';
import { EmployeeForm } from './EmployeeForm';
import { ProjectForm } from './ProjectForm';
import { getOrInitMonthData } from '../services/storageService';
import { getTotalProfit } from '../services/dataService'; 

export class App {
  private monthKey: string = '';
  private employeeList: EmployeeList;
  private projectList: ProjectList;
  private profitDisplay: HTMLElement;

  constructor() {
    const now = new Date();
    this.monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    getOrInitMonthData(this.monthKey);

    // Безопасное получение элементов (Strict Mode friendly)
    const profitEl = document.getElementById('total-profit');
    const employeeListEl = document.getElementById('employee-list');
    const projectListEl = document.getElementById('project-list');

    // Проверяем всё разом, чтобы не плодить ошибки в рантайме
    if (!profitEl || !employeeListEl || !projectListEl) {
      throw new Error('Критические элементы DOM не найдены. Проверьте index.html');
    }

    this.profitDisplay = profitEl;
    this.employeeList = new EmployeeList(employeeListEl);
    this.projectList = new ProjectList(projectListEl);

    this.initEvents();
    this.update();
  }

  private initEvents() {
    const overlay = document.getElementById('modal-overlay');
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const addProjectBtn = document.getElementById('add-project-btn');
    const modalClose = document.getElementById('modal-close');
    const monthContainer = document.getElementById('month-selector-container');

    if (!overlay || !addEmployeeBtn || !addProjectBtn || !modalClose || !monthContainer) {
      console.warn('Некоторые элементы управления не найдены');
      return;
    }

    // 1. Добавление сотрудника
    addEmployeeBtn.addEventListener('click', () => {
      new EmployeeForm(this.monthKey, () => this.update()).show();
    });

    // 2. Добавление проекта (лучше через addEventListener)
    addProjectBtn.addEventListener('click', () => {
      new ProjectForm(this.monthKey, () => this.update()).show();
    });

    // 3. Управление модальным окном
    modalClose.addEventListener('click', () => {
      overlay.style.display = 'none';
    });

    overlay.addEventListener('click', (e: MouseEvent) => {
      if (e.target === overlay) overlay.style.display = 'none';
    });

    // 4. Селектор месяца
    new MonthSelector(
      monthContainer,
      this.monthKey,
      (newKey) => {
        this.monthKey = newKey;
        this.update();
      }
    );
   }
  public update(): void {
    const data = getOrInitMonthData(this.monthKey);
    const profit = getTotalProfit(data);

    this.employeeList.update(data, this.monthKey);
    this.projectList.update(data, this.monthKey);

    this.profitDisplay.textContent = `${profit.toLocaleString()} $`;
    this.profitDisplay.className = profit >= 0 ? 'positive' : 'negative';
  }
}