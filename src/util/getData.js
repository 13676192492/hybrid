export function getToken() {
    let token = localStorage.getItem('token');
    if (!token||token=='null')
        token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE1ODU4MTIzMzgsImV4cCI6MTU4NTgyMTgwNSwiaXNzIjoiaHR0cDovL3d3dy50YWljaHVhbi5jb20iLCJhdWQiOiJ1aG9tZSIsImNsaWVudF9pZCI6InVob21lLmlvcyIsInN1YiI6IjEyNDU1OTExODEyNTg1MzQ5MTIiLCJhdXRoX3RpbWUiOjE1ODU4MTIzMzgsImlkcCI6ImxvY2FsIiwicm9sZSI6IlVTRVIiLCJuYW1lIjoiemh1aHUxMDMxMCIsInRlbmFudF9pZCI6IjczMzk1NjYxNDA1Nzk4NDAiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwidWhvbWUiLCJ1aG9tZS5vMm8iLCJ1aG9tZS5wYXJrIiwidWhvbWUucmtlIl0sImFtciI6WyJwd2QiXSwianRpIjoiOGZkMDBkZGEtNThiMC00YzYzLWExZmItNzllNzI2MjE1NzQ4IiwiaWF0IjoxNTg1ODE4MjA1fQ.pYIpi5pM1K574cWYohX3m-EG4Pb0K5qb4OZ6OxvnQ0I';
    return token;
}

export function getComId() {
    let comId = localStorage.getItem('comId');
    if (!comId||comId=='null')
        comId = '1245590830786686976';
    return comId;
}