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

  async findOne(id: string): Promise<{ course: Course }> {
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

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<{ course: Course }> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Course not found!');
    }
    const updated = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { returnDocument: 'after' })
      .exec();
    if (!updated) {
      throw new NotFoundException('Course not found!');
    }

    return { course: updated };
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Course not found!');
    }

    const deleted = await this.courseModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Course not found!');
    }
    return { message: 'Course deleted successfully!' };
  }
}
