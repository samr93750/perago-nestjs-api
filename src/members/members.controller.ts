import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { CreateMemberDto } from '../common/dto/create-member.dto';
import { UpdateMemberDto } from '../common/dto/update-member.dto';
import { Member } from '../common/entities/member.entity';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiBody({ type: CreateMemberDto })
  create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all members' })
  findAll(): Promise<Member[]> {
    return this.membersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string): Promise<Member> {
    return this.membersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a member by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateMemberDto })
  update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a member by ID' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string): Promise<void> {
    return this.membersService.remove(id);
  }
}
