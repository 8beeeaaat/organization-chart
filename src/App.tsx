import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import './App.css';
import gLoginButton from './assets/btn_google_signin_light_normal_web.png';
import { DivisionList } from './components/organisms/DivisionList';
import { Header } from './components/organisms/Header';
import { MemberCharts } from './components/organisms/MemberCharts';
import {
  Departments,
  Groups,
  KEY,
  Master,
  Member,
  MemberListByStreamAlignedTeams,
  MemberListByTag,
  Organization,
  Roles,
  StreamAlignedTeams,
  Tags,
} from './types';

function App({
  authInstance,
  spreadsheetId,
}: {
  authInstance: gapi.auth2.GoogleAuth;
  spreadsheetId: string;
}) {
  const [userState, setUserState] = useState<gapi.auth2.GoogleUser>();
  const [divisionSheetState, setDivisionSheetState] =
    useState<gapi.client.sheets.ValueRange>();
  const [departmentSheetState, setDepartmentSheetState] =
    useState<gapi.client.sheets.ValueRange>();
  const [groupSheetState, setGroupSheetState] =
    useState<gapi.client.sheets.ValueRange>();
  const [roleSheetState, setRoleSheetState] =
    useState<gapi.client.sheets.ValueRange>();
  const [streamAlignedTeamSheetState, setStreamAlignedTeamSheetState] =
    useState<gapi.client.sheets.ValueRange>();
  const [tagSheetState, setTagSheetState] =
    useState<gapi.client.sheets.ValueRange>();
  const [masterState, setMasterState] = useState<Master>();
  const [userSheetState, setUserSheetState] =
    useState<gapi.client.sheets.ValueRange>();
  const [organizationState, setOrganizationState] = useState<Organization>();
  const [memberState, setMemberState] = useState<Member[]>();

  async function login() {
    try {
      const user = await authInstance.signIn();
      setUserState(user);

      setDivisionSheetState(
        (
          await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `master_division`,
          })
        ).result
      );
      setDepartmentSheetState(
        (
          await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `master_department`,
          })
        ).result
      );
      setGroupSheetState(
        (
          await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `master_group`,
          })
        ).result
      );
      setRoleSheetState(
        (
          await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `master_role`,
          })
        ).result
      );
      setStreamAlignedTeamSheetState(
        (
          await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `master_stream_aligned_team`,
          })
        ).result
      );
      setTagSheetState(
        (
          await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `master_tag`,
          })
        ).result
      );

      setUserSheetState(
        (
          await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `table`,
          })
        ).result
      );
    } catch (error) {
      alert('Error: ' + error);
    }
  }
  async function logout() {
    try {
      await authInstance.signOut();
      setUserState(undefined);
      setUserSheetState(undefined);
      window.location.reload();
    } catch (error) {
      alert('Error: ' + error);
    }
  }

  function rollup<
    T extends Departments | Groups | Roles | StreamAlignedTeams | Tags
  >(rows: any[][]): T {
    const keys = rows[0] as (keyof T)[];
    const valueRows = rows?.filter((_, i) => i > 0);
    return valueRows.reduce((acc, row) => {
      const values: T[keyof T] = row.reduce((acc, value, i) => {
        acc[keys[i]] = value;
        return acc;
      }, {});
      acc[values[KEY]] = values;
      return acc;
    }, {} as T);
  }

  useEffect(() => {
    if (!divisionSheetState || !divisionSheetState.values) return;
    if (!departmentSheetState || !departmentSheetState.values) return;
    if (!groupSheetState || !groupSheetState.values) return;
    if (!roleSheetState || !roleSheetState.values) return;
    if (!streamAlignedTeamSheetState || !streamAlignedTeamSheetState.values)
      return;
    if (!tagSheetState || !tagSheetState.values) return;
    setMasterState({
      divisions: rollup(divisionSheetState.values),
      departments: rollup(departmentSheetState.values),
      groups: rollup(groupSheetState.values),
      roles: rollup(roleSheetState.values),
      streamAlignedTeams: rollup(streamAlignedTeamSheetState.values),
      tags: rollup(tagSheetState.values),
    });
  }, [
    divisionSheetState,
    departmentSheetState,
    groupSheetState,
    roleSheetState,
    streamAlignedTeamSheetState,
    tagSheetState,
  ]);

  useEffect(() => {
    if (!masterState || !userSheetState || !userSheetState.values) return;
    const userKeys = userSheetState.values[0];
    const streamAlignedTeamsKeys = Object.keys(masterState.streamAlignedTeams);

    const members: Member[] = userSheetState.values
      ?.filter((_, i) => i > 0)
      .map((row) => {
        return {
          name: row[userKeys.indexOf('name')],
          division: masterState.divisions[row[userKeys.indexOf('division')]],
          department:
            masterState.departments[row[userKeys.indexOf('department')]],
          dispname: row[userKeys.indexOf('dispname')],
          streamAlignedTeam:
            masterState.streamAlignedTeams[
              row[userKeys.indexOf('stream_aligned_team')]
            ],
          isDivisionManager:
            row[userKeys.indexOf('is_division_manager')] === 'TRUE',
          isDepartmentManager:
            row[userKeys.indexOf('is_department_manager')] === 'TRUE',
          isGroupLeader: row[userKeys.indexOf('is_group_leader')] === 'TRUE',
          group: masterState.groups[row[userKeys.indexOf('group')]],
          role: masterState.roles[row[userKeys.indexOf('role')]],
          tag: masterState.tags[row[userKeys.indexOf('tag')]],
          workingRate: Number(row[userKeys.indexOf('working_rate')]),
          enabled: row[userKeys.indexOf('enabled')] === 'TRUE',
          commits: streamAlignedTeamsKeys.reduce(
            (ret, streamAlignedTeamsKey) => {
              ret[streamAlignedTeamsKey] = {
                name: masterState.streamAlignedTeams[streamAlignedTeamsKey]
                  .name,
                rate: Math.round(
                  Number(row[userKeys.indexOf(streamAlignedTeamsKey)]) *
                    Number(row[userKeys.indexOf('working_rate')]) *
                    Number(row[userKeys.indexOf('commits_rate')]) *
                    10
                ),
                color:
                  masterState.streamAlignedTeams[streamAlignedTeamsKey].color,
              };
              return ret;
            },
            {} as Member['commits']
          ),
        };
      })
      .filter((m) => m.enabled)
      .sort((m) => (m.isGroupLeader ? -1 : 0))
      .sort((m) => (m.isDepartmentManager ? -1 : 0));
    setMemberState(members);
  }, [masterState, userSheetState]);

  useEffect(() => {
    if (!memberState || !masterState) return;
    const streamAlignedTeamsKeys = Object.keys(masterState.streamAlignedTeams);
    const tagKeys = Object.keys(masterState.tags);
    setOrganizationState({
      membersByTag: tagKeys.reduce((ret, tagKey) => {
        ret[tagKey] = memberState.filter(
          (member) => member.tag[KEY] === tagKey
        );
        return ret;
      }, {} as MemberListByTag),
      membersByTeams: streamAlignedTeamsKeys.reduce((ret, teamKey) => {
        ret[teamKey] = memberState.filter(
          (member) => member.streamAlignedTeam[KEY] === teamKey
        );
        return ret;
      }, {} as MemberListByStreamAlignedTeams),
    });
  }, [memberState, masterState]);

  if (!gapi.auth2) return null;

  return (
    <div
      className={classnames(
        'relative',
        'grid',
        'grid-flow-row',
        'gap-2',
        'bg-gray-200'
      )}
    >
      <Header
        className={classnames(
          'sticky',
          'top-0',
          'bg-gray-100',
          'p-4',
          'z-10',
          'shadow-lg'
        )}
        user={userState}
        onClickLogout={logout}
      ></Header>
      <main className={classnames('relative', 'flex', 'p-4', 'gap-4')}>
        {masterState && organizationState ? (
          <>
            {memberState ? (
              <>
                <DivisionList
                  className={classnames(
                    'relative',
                    'bg-gray-50',
                    'p-4',
                    'shadow-lg'
                  )}
                  master={masterState}
                  members={memberState}
                />
              </>
            ) : null}
            <MemberCharts
              className='relative bg-gray-50 p-4 shadow-lg w-full'
              organization={organizationState}
              master={masterState}
            />
          </>
        ) : (
          <button
            className={classnames('justify-self-center', 'm-auto')}
            onClick={login}
          >
            <img src={gLoginButton} alt='' />
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
