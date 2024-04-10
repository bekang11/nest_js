// import { Repository, EntityRepository } from 'typeorm';
// import { Task } from './task.entity';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { TaskStatus } from './task-status.enum';

// @EntityRepository()
// export class TasksRepository extends Repository<Task> {
//   async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
//     const { title, description } = createTaskDto;
//     const task = this.create({
//       title,
//       description,
//       status: TaskStatus.OPEN,
//     });
//     await this.save(task);
//     return task;
//   }
// }

import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
  async getTaskById(id: string): Promise<Task> {
    const task = await this.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}
