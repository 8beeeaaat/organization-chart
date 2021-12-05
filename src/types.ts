export const USER_SHEET_KEYS = [
  'commits_rate',
  'department',
  'dispname',
  'enabled',
  'feature_team',
  'group',
  'is_department_manager',
  'is_group_leader',
  'name',
  'role',
  'tag',
  'working_rate',
] as const;

export type SheetKeys = typeof USER_SHEET_KEYS[number];

export const KEY = 'key' as const;

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

export type Team = {
  [KEY]: string;
  color: string;
  name: string;
};
export type TeamKeys = keyof Team;
export type Teams = {
  [key: Team['key']]: Team;
};

export type Tag = {
  [KEY]: string;
};
export type TagKeys = keyof Tag;
export type Tags = {
  [key: Tag['key']]: Tag;
};

export type Master = {
  departments: Departments;
  teams: Teams;
  groups: Groups;
  roles: Roles;
  tags: Tags;
};

export type Member = {
  department: Department;
  dispname: string;
  enabled: boolean;
  featureTeam: Team;
  isGroupLeader: boolean;
  isDepartmentManager: boolean;
  group: Group;
  name: string;
  role: Role;
  tag: Tag;
  workingRate: number;
} & {
  commits: {
    [key: Team['key']]: {
      rate: number;
      color: Team['color'];
      name: Team['name'];
    };
  };
};

export type MemberList = {
  [key: Tag['key']]: Member[];
};

export type Organization = {
  [key: Teams[typeof KEY]['key']]: MemberList;
};
