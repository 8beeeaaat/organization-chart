export const USER_SHEET_KEYS = [
  'commits_rate',
  'division',
  'department',
  'dispname',
  'enabled',
  'stream_aligned_team',
  'group',
  'is_division_manager',
  'is_department_manager',
  'is_group_leader',
  'name',
  'role',
  'tag',
  'working_rate',
] as const;

export type SheetKeys = typeof USER_SHEET_KEYS[number];

export const KEY = 'key' as const;

export type Division = {
  [KEY]: string;
  name: string;
};
export type DivisionKeys = keyof Division;
export type Divisions = {
  [key: Division['key']]: Division;
};

export type Department = {
  [KEY]: string;
  name: string;
};
export type DepartmentKeys = keyof Department;
export type Departments = {
  [key: Department['key']]: Department;
};

export type Group = {
  [KEY]: string;
  name: string;
};
export type GroupKeys = keyof Group;
export type Groups = {
  [key: Group['key']]: Group;
};

export type Role = {
  [KEY]: string;
  name: string;
};
export type RoleKeys = keyof Role;
export type Roles = {
  [key: Role['key']]: Role;
};

export type StreamAlignedTeam = {
  [KEY]: string;
  color: string;
  name: string;
};
export type StreamAlignedTeamKeys = keyof StreamAlignedTeam;
export type StreamAlignedTeams = {
  [key: StreamAlignedTeam['key']]: StreamAlignedTeam;
};

export type Tag = {
  [KEY]: string;
  order: number;
};
export type TagKeys = keyof Tag;
export type Tags = {
  [key: Tag['key']]: Tag;
};

export type Master = {
  divisions: Divisions;
  departments: Departments;
  streamAlignedTeams: StreamAlignedTeams;
  groups: Groups;
  roles: Roles;
  tags: Tags;
};

export type Member = {
  division: Division;
  department: Department;
  dispname: string;
  enabled: boolean;
  streamAlignedTeam: StreamAlignedTeam;
  isGroupLeader: boolean;
  isDepartmentManager: boolean;
  isDivisionManager: boolean;
  group: Group;
  name: string;
  role: Role;
  tag: Tag;
  workingRate: number;
} & {
  commits: {
    [key: StreamAlignedTeam['key']]: {
      rate: number;
      color: StreamAlignedTeam['color'];
      name: StreamAlignedTeam['name'];
    };
  };
};

export type MemberListByTag = {
  [key: Tag['key']]: Member[];
};

export type MemberListByStreamAlignedTeams = {
  [key: StreamAlignedTeams[typeof KEY]['key']]: Member[];
};

export type Organization = {
  membersByTag: MemberListByTag;
  membersByTeams: MemberListByStreamAlignedTeams;
};
