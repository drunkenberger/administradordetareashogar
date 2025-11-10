# Element IDs Catalog

| ID | Component | Description | File | Line |
|----|-----------|-------------|------|------|
| weeknav-prev-001 | WeekNav | Previous week navigation button | src/components/WeekNav/index.tsx | 27 |
| weeknav-next-002 | WeekNav | Next week navigation button | src/components/WeekNav/index.tsx | 36 |
| weeknav-today-003 | WeekNav | Today navigation button | src/components/WeekNav/index.tsx | 44 |
| header-nav-004 | Header | Main navigation header | src/PlanificadorTareas.tsx | TBD |
| filter-category-005 | FilterBar | Category filter dropdown | src/components/FilterBar/index.tsx | TBD |
| filter-assignee-006 | FilterBar | Assignee filter dropdown | src/components/FilterBar/index.tsx | TBD |
| view-toggle-week-007 | ViewToggle | Week view toggle button | src/components/ViewToggle/index.tsx | TBD |
| view-toggle-day-008 | ViewToggle | Day view toggle button | src/components/ViewToggle/index.tsx | TBD |
| view-toggle-grid-013 | ViewToggle | Grid view toggle button | src/PlanificadorTareas.tsx | 231 |
| weekend-toggle-009 | Settings | Weekend visibility toggle | src/components/Settings/index.tsx | TBD |
| export-button-010 | Actions | Export JSON button | src/components/Actions/index.tsx | TBD |
| import-button-011 | Actions | Import JSON button | src/components/Actions/index.tsx | TBD |
| clear-all-button-012 | Actions | Clear all tasks button | src/components/Actions/index.tsx | TBD |
| add-chore-button-013 | AddChore | Main add chore button | src/components/AddChoreDialog/index.tsx | TBD |
| auto-plan-button-014 | AutoPlanButton | Generate automatic weekly plan button | src/components/AutoPlanButton/index.tsx | 47 |
| quick-add-select-015 | QuickAdd | Template selection dropdown | src/components/QuickAdd/index.tsx | TBD |
| quick-add-day-016 | QuickAdd | Day selection dropdown | src/components/QuickAdd/index.tsx | TBD |
| quick-add-time-017 | QuickAdd | Time input field | src/components/QuickAdd/index.tsx | TBD |
| quick-add-assignee-018 | QuickAdd | Assignee selection | src/components/QuickAdd/index.tsx | TBD |
| quick-add-submit-019 | QuickAdd | Submit button | src/components/QuickAdd/index.tsx | TBD |
| template-insert-020 | TemplateButton | Insert daily template button | src/components/TemplateButton/index.tsx | TBD |
| chore-block-021 | ChoreBlock | Individual chore block (dynamic) | src/components/ChoreBlock/index.tsx | TBD |
| chore-form-title-022 | ChoreForm | Title input field | src/components/ChoreForm/index.tsx | TBD |
| chore-form-day-023 | ChoreForm | Day selection dropdown | src/components/ChoreForm/index.tsx | TBD |
| chore-form-start-024 | ChoreForm | Start time input | src/components/ChoreForm/index.tsx | TBD |
| chore-form-duration-025 | ChoreForm | Duration input | src/components/ChoreForm/index.tsx | TBD |
| chore-form-category-026 | ChoreForm | Category dropdown | src/components/ChoreForm/index.tsx | TBD |
| chore-form-assignee-027 | ChoreForm | Assignee dropdown | src/components/ChoreForm/index.tsx | TBD |
| chore-form-notes-028 | ChoreForm | Notes input field | src/components/ChoreForm/index.tsx | TBD |
| chore-form-delete-029 | ChoreForm | Delete button | src/components/ChoreForm/index.tsx | TBD |
| chore-form-save-030 | ChoreForm | Save button | src/components/ChoreForm/index.tsx | TBD |
| day-view-prev-031 | DayView | Previous day button | src/views/DayView/index.tsx | TBD |
| day-view-next-032 | DayView | Next day button | src/views/DayView/index.tsx | TBD |
| day-view-today-033 | DayView | Today button | src/views/DayView/index.tsx | TBD |
| task-detail-close-edit-034 | TaskDetailView | Close edit mode button | src/views/TaskDetailView/index.tsx | 51 |
| task-detail-title-035 | TaskDetailView | Task title display | src/views/TaskDetailView/index.tsx | 91 |
| task-detail-close-036 | TaskDetailView | Close detail view button | src/views/TaskDetailView/index.tsx | 102 |
| task-detail-day-037 | TaskDetailView | Day display | src/views/TaskDetailView/index.tsx | 130 |
| task-detail-time-038 | TaskDetailView | Time display | src/views/TaskDetailView/index.tsx | 144 |
| task-detail-duration-039 | TaskDetailView | Duration display | src/views/TaskDetailView/index.tsx | 158 |
| task-detail-assignee-040 | TaskDetailView | Assignee display | src/views/TaskDetailView/index.tsx | 179 |
| task-detail-notes-041 | TaskDetailView | Notes display | src/views/TaskDetailView/index.tsx | 197 |
| task-detail-edit-042 | TaskDetailView | Edit button | src/views/TaskDetailView/index.tsx | 207 |
| task-detail-delete-043 | TaskDetailView | Delete button | src/views/TaskDetailView/index.tsx | 215 |
| editable-template-trigger-044 | EditableTemplateDialog | Trigger button for editable template | src/components/EditableTemplateDialog/index.tsx | 110 |
| template-add-task-045 | EditableTemplateDialog | Add new task button | src/components/EditableTemplateDialog/index.tsx | 127 |
| template-reset-046 | EditableTemplateDialog | Reset to defaults button | src/components/EditableTemplateDialog/index.tsx | 134 |
| template-cancel-047 | EditableTemplateDialog | Cancel dialog button | src/components/EditableTemplateDialog/index.tsx | 271 |
| template-apply-048 | EditableTemplateDialog | Apply template button | src/components/EditableTemplateDialog/index.tsx | 277 |

## Naming Convention
Pattern: `[component]-[function]-[number]`
- component: Component name in lowercase (e.g., weeknav, chore-form)
- function: Main function/purpose (e.g., prev, next, submit)
- number: Sequential three-digit number

## Usage Guidelines
1. Always use these IDs when referring to UI elements in conversations
2. Update this catalog when adding new interactive elements
3. Remove entries when elements are deleted
4. Keep the sequential numbering consistent