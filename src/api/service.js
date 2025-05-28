export const service = {
	login: 'sys/login', //登录
	logout: 'sys/logout', //登出
	getMenuBar: "sys/permission/getUserPermissionByToken",//菜单路由表
	// 用户管理
	UserList: "sys/user/list",//用户列表
	userAdd: "sys/user/add",//添加用户
	userEdit: "sys/user/edit",//编辑用户
	userDelete: "sys/user/delete",//删除用户
	changePassword: "sys/user/changePassword",//修改密码
	roleList: "sys/role/queryall", //角色列表
	getRoleId: "sys/user/queryUserRole",//角色id
	getDeptTreeList: "sys/tmpDeptInfo/list",//获取机构
	duplicateCheck: "sys/duplicate/check",///重复校验
	// 菜单管理
	getmenulist: "sys/permission/list",//系统管理-菜单列表
	deletePermission: "sys/permission/delete",//系统管理-删除菜单
	addPermission: "sys/permission/add",//系统管理-新增菜单
	editPermission: "sys/permission/edit",//系统管理-编辑菜单
	deleteAllPermission: "sys/permission/deleteBatch",//批量删除菜单
	// 角色管理
	queryRoleList: 'sys/role/list',//查询角色列表
	roleDelete: 'sys/role/delete',//删除角色
	addRole: "sys/role/add",//新增角色
	editRole: "sys/role/edit",//编辑角色
	userRoleList: "sys/user/userRoleList",//查询当前角色用户
	deleteUserRole: "sys/user/deleteUserRole",//当前角色移出用户
	addSysUserRole: "sys/user/addSysUserRole",//添加用户到当前角色
	queryMenuTreeList: "sys/role/queryTreeList",//菜单权限树
	queryRolePermission:"sys/permission/queryRolePermission",//角色菜单权限key
	saveRolePermission:"sys/permission/saveRolePermission",//保存菜单权限

	// 机构管理
	getDeptTree: "sys/tmpDeptInfo/getDeptTree",//查询机构
}
// 配置二级地址
for (let key in service) {
	service[key] = window.envConfig['API_BASE_PORT'] + "/" + service[key]
}