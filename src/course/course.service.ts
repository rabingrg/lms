import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<{ course: Course }> {
    const course = await this.courseModel.create(createCourseDto);
    return { course };
  }

  async findAll(): Promise<{ courses: Course[] | [] }> {
    const courses = await this.courseModel.find().exec();
    return {
      courses: courses ?? [],
    };
  }

  async findOne(id: string): Promise<{ course: Course } | null> {
    // if random ids are passed
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Course not found!');
    }
    const course = await this.courseModel.findOne({ _id: id }).exec();
    if (!course) {
      throw new NotFoundException('Course not found!');
    }
    return { course };
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
