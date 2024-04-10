import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id: id });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
  async deleteTaskById(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
    // private tasks: Task[] = [];
    // getAllTasks(): Task[] {
    //   return this.tasks;
    // }
    // getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
    //   const { status, search } = filterDto;
    //   let tasks = this.getAllTasks();
    //   if (status) {
    //     tasks = tasks.filter((task) => task.status === status);
    //   }
    //   if (search) {
    //     tasks = tasks.filter((task) => {
    //       if (task.title.includes(search) || task.description.includes(search)) {
    //         return true;
    //       }
    //       return false;
    //     });
    //   }
    //   return tasks;
    // }
    // getTaskById(id: string): Task {
    //   return this.tasks.find((task) => task.id === id);
    // }
    // deleteTaskById(id: string): void {
    //   this.tasks = this.tasks.filter((task) => task.id !== id);
    // }
    // updateTaskStatus(id: string, status: TaskStatus) {
    //   const task = this.getTaskById(id);
    //   task.status = status;
    //   return task;
    // }
    // createTask(createTaskDto: CreateTaskDto): Task {
    //   const { title, description } = createTaskDto;
    //   const task: Task = {
    //     id: uuid(),
    //     title,
    //     description,
    //     status: TaskStatus.OPEN,
    //   };
    //   this.tasks.push(task);
    //   return task;
    // }
  }
}
