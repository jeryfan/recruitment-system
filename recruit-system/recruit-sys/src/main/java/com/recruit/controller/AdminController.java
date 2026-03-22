package com.recruit.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.recruit.dto.category.CreateOrUpdateCategoryDTO;
import com.recruit.model.CategoryDO;
import com.recruit.model.CompanyDO;
import com.recruit.service.CategoryService;
import com.recruit.service.CompanyService;
import com.recruit.service.PermissionService;
import com.recruit.service.PositionService;
import io.github.talelin.autoconfigure.exception.NotFoundException;
import io.github.talelin.core.annotation.AdminRequired;
import io.github.talelin.core.annotation.Logger;
import io.github.talelin.core.annotation.PermissionMeta;
import io.github.talelin.core.annotation.PermissionModule;
import com.recruit.bo.GroupPermissionBO;
import com.recruit.common.mybatis.Page;
import com.recruit.common.util.PageUtil;
import com.recruit.dto.admin.DispatchPermissionDTO;
import com.recruit.dto.admin.DispatchPermissionsDTO;
import com.recruit.dto.admin.NewGroupDTO;
import com.recruit.dto.admin.RemovePermissionsDTO;
import com.recruit.dto.admin.ResetPasswordDTO;
import com.recruit.dto.admin.UpdateGroupDTO;
import com.recruit.dto.admin.UpdateUserInfoDTO;
import com.recruit.model.GroupDO;
import com.recruit.model.PermissionDO;
import com.recruit.model.UserDO;
import com.recruit.model.ApplicationDO;
import com.recruit.model.PositionDO;
import com.recruit.service.AdminService;
import com.recruit.service.ApplicationService;
import com.recruit.service.GroupService;
import com.recruit.service.UserService;
import com.recruit.vo.CreatedVO;
import com.recruit.vo.DeletedVO;
import com.recruit.vo.PageResponseVO;
import com.recruit.vo.UpdatedVO;
import com.recruit.vo.UserInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Validated
@RestController
@RequestMapping("/recruit/admin")
@PermissionModule(value = "管理员")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private PositionService positionService;

    @Autowired
    private ApplicationService applicationService;

    @GetMapping("/permission")
    @PermissionMeta(value = "查询所有可分配的权限")
    public Map<String, List<PermissionDO>> getAllPermissions() {
        return adminService.getAllStructuralPermissions();
    }

    @GetMapping("/users")
    @PermissionMeta(value = "查询所有用户")
    public PageResponseVO<UserInfoVO> getUsers(
            @RequestParam(name = "group_id", required = false)
            @Min(value = 1, message = "{group.id.positive}") Integer groupId,
            @RequestParam(name = "count", required = false, defaultValue = "10")
            @Min(value = 1, message = "{page.count.min}")
            @Max(value = 30, message = "{page.count.max}") Integer count,
            @RequestParam(name = "page", required = false, defaultValue = "0")
            @Min(value = 0, message = "{page.number.min}") Integer page) {
        IPage<UserDO> iPage = adminService.getUserPageByGroupId(groupId, count, page);
        List<UserInfoVO> userInfos = iPage.getRecords().stream().map(user -> {
            List<GroupDO> groups = groupService.getUserGroupsByUserId(user.getId());
            return new UserInfoVO(user, groups);
        }).collect(Collectors.toList());
        return PageUtil.build(iPage, userInfos);
    }


    @PutMapping("/user/{id}/password")
    @PermissionMeta(value = "修改用户密码")
    public UpdatedVO changeUserPassword(@PathVariable @Positive(message = "{id.positive}") Integer id, @RequestBody @Validated ResetPasswordDTO validator) {
        adminService.changeUserPassword(id, validator);
        return new UpdatedVO(4);
    }


    @DeleteMapping("/user/{id}")
    @PermissionMeta(value = "删除用户")
    public DeletedVO deleteUser(@PathVariable @Positive(message = "{id.positive}") Integer id) {
        adminService.deleteUser(id);
        return new DeletedVO(5);
    }


    @PutMapping("/user/{id}")
    @PermissionMeta(value = "管理员更新用户信息")
    public UpdatedVO updateUser(@PathVariable @Positive(message = "{id.positive}") Integer id, @RequestBody @Validated UpdateUserInfoDTO validator) {
        adminService.updateUserInfo(id, validator);
        return new UpdatedVO(6);
    }


    @GetMapping("/group")
    @PermissionMeta(value = "查询所有权限组及其权限")
    public PageResponseVO<GroupDO> getGroups(
            @RequestParam(name = "count", required = false, defaultValue = "10")
            @Min(value = 1, message = "{page.count.min}")
            @Max(value = 30, message = "{page.count.max}") Integer count,
            @RequestParam(name = "page", required = false, defaultValue = "0")
            @Min(value = 0, message = "{page.number.min}") Integer page) {
        IPage<GroupDO> iPage = adminService.getGroupPage(page, count);
        return PageUtil.build(iPage);
    }


    @GetMapping("/group/all")
    @PermissionMeta(value = "查询所有权限组")
    public List<GroupDO> getAllGroup() {
        return adminService.getAllGroups();
    }


    @GetMapping("/group/{id}")
    @PermissionMeta(value = "查询一个权限组及其权限")
    public GroupPermissionBO getGroup(@PathVariable @Positive(message = "{id.positive}") Integer id) {
        return adminService.getGroup(id);
    }


    @PostMapping("/group")
    @PermissionMeta(value = "新建权限组")
    public CreatedVO createGroup(@RequestBody @Validated NewGroupDTO validator) {
        adminService.createGroup(validator);
        return new CreatedVO(15);
    }

    @PutMapping("/group/{id}")
    @PermissionMeta(value = "更新一个权限组")
    public UpdatedVO updateGroup(@PathVariable @Positive(message = "{id.positive}") Integer id,
                                 @RequestBody @Validated UpdateGroupDTO validator) {
        adminService.updateGroup(id, validator);
        return new UpdatedVO(7);
    }


    @DeleteMapping("/group/{id}")
    @PermissionMeta(value = "删除一个权限组")
    public DeletedVO deleteGroup(@PathVariable @Positive(message = "{id.positive}") Integer id) {
        adminService.deleteGroup(id);
        return new DeletedVO(8);
    }

    @PostMapping("/permission/dispatch")
    @PermissionMeta(value = "分配单个权限")
    public CreatedVO dispatchPermission(@RequestBody @Validated DispatchPermissionDTO validator) {
        adminService.dispatchPermission(validator);
        return new CreatedVO(9);
    }


    @PostMapping("/permission/dispatch/batch")
    @PermissionMeta(value = "分配多个权限")
    public CreatedVO dispatchPermissions(@RequestBody @Validated DispatchPermissionsDTO validator) {
        adminService.dispatchPermissions(validator);
        return new CreatedVO(9);
    }


    @PostMapping("/permission/remove")
    @PermissionMeta(value = "删除多个权限")
    public DeletedVO removePermissions(@RequestBody @Validated RemovePermissionsDTO validator) {
        adminService.removePermissions(validator);
        return new DeletedVO(10);
    }

    // ========== 用户状态管理 ==========

    /**
     * 切换用户激活状态（启用/禁用）
     */
    @PutMapping("/users/{id}/state")
    @PermissionMeta(value = "切换用户状态")
    public UpdatedVO updateUserState(
            @PathVariable @Positive(message = "{id.positive}") Integer id,
            @RequestBody Map<String, Integer> body) {
        UserDO user = userService.getById(id);
        if (user == null) {
            throw new NotFoundException(10021);
        }
        Integer state = body.get("state");
        if (state == null) {
            state = 0;
        }
        UserDO update = new UserDO();
        update.setId(id);
        update.setState(state);
        userService.updateById(update);
        return new UpdatedVO(6);
    }

    // ========== 公司管理代理端点 ==========

    /**
     * 管理员分页查询公司列表
     */
    @GetMapping("/companies")
    @PermissionMeta(value = "管理员查询公司列表")
    public PageResponseVO<CompanyDO> getCompanies(
            @RequestParam(name = "count", required = false, defaultValue = "10")
            @Min(value = 1, message = "{page.count.min}")
            @Max(value = 30, message = "{page.count.max}") Integer count,
            @RequestParam(name = "page", required = false, defaultValue = "0")
            @Min(value = 0, message = "{page.number.min}") Integer page,
            @RequestParam(name = "state", required = false) Integer state) {
        Page<CompanyDO> pager = new Page<>(page, count);
        QueryWrapper<CompanyDO> wrapper = new QueryWrapper<>();
        if (state != null) {
            wrapper.eq("state", state);
        }
        IPage<CompanyDO> paging = companyService.getBaseMapper().selectPage(pager, wrapper);
        return PageUtil.build(paging);
    }

    /**
     * 管理员审核公司（通过/拒绝）
     */
    @PutMapping("/companies/{id}/audit")
    @PermissionMeta(value = "管理员审核公司")
    public UpdatedVO auditCompany(
            @PathVariable @Positive(message = "{id.positive}") Integer id,
            @RequestBody Map<String, Integer> body) {
        CompanyDO company = companyService.getById(id);
        if (company == null) {
            throw new NotFoundException(30000);
        }
        Integer state = body.get("state");
        if (state == null) {
            throw new NotFoundException(30001);
        }
        companyService.updateState(id, state);
        return new UpdatedVO(3100);
    }

    // ========== 分类管理代理端点 ==========

    /**
     * 管理员获取所有分类
     */
    @GetMapping("/categories")
    @PermissionMeta(value = "管理员查询分类列表")
    public List<CategoryDO> getCategories() {
        return categoryService.getAll();
    }

    /**
     * 管理员新增分类
     */
    @PostMapping("/categories")
    @PermissionMeta(value = "管理员新增分类")
    public CreatedVO createCategory(@RequestBody @Validated CreateOrUpdateCategoryDTO validator) {
        categoryService.createCategory(validator);
        return new CreatedVO(5000);
    }

    /**
     * 管理员更新分类
     */
    @PutMapping("/categories/{id}")
    @PermissionMeta(value = "管理员更新分类")
    public UpdatedVO updateCategory(
            @PathVariable @Positive(message = "{id.positive}") Integer id,
            @RequestBody @Validated CreateOrUpdateCategoryDTO validator) {
        CategoryDO categoryDO = categoryService.getById(id);
        if (categoryDO == null) {
            throw new NotFoundException(50000);
        }
        categoryService.updateCategory(categoryDO, validator);
        return new UpdatedVO(5100);
    }

    /**
     * 管理员删除分类
     */
    @DeleteMapping("/categories/{id}")
    @PermissionMeta(value = "管理员删除分类")
    public DeletedVO deleteCategory(
            @PathVariable @Positive(message = "{id.positive}") Integer id) {
        CategoryDO categoryDO = categoryService.getById(id);
        if (categoryDO == null) {
            throw new NotFoundException(50000);
        }
        categoryService.deleteById(id);
        return new DeletedVO(5200);
    }

    // ========== 数据统计 ==========

    /**
     * 管理员获取系统数据统计概览
     */
    @GetMapping("/stats")
    @PermissionMeta(value = "系统统计数据")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        // 用户总数（排除root用户）
        Integer rootId = userService.getRootUserId();
        QueryWrapper<UserDO> userWrapper = new QueryWrapper<>();
        userWrapper.lambda().ne(UserDO::getId, rootId);
        stats.put("totalUsers", (long) userService.count(userWrapper));
        // 公司总数
        stats.put("totalCompanies", (long) companyService.count());
        // 待审核公司数
        QueryWrapper<CompanyDO> pendingWrapper = new QueryWrapper<>();
        pendingWrapper.eq("state", 0);
        stats.put("pendingCompanies", (long) companyService.count(pendingWrapper));
        // 已通过公司数
        QueryWrapper<CompanyDO> approvedWrapper = new QueryWrapper<>();
        approvedWrapper.eq("state", 1);
        stats.put("approvedCompanies", (long) companyService.count(approvedWrapper));
        // 职位总数
        stats.put("totalPositions", (long) positionService.count());
        // 分类总数
        stats.put("totalCategories", (long) categoryService.count());
        stats.put("totalApplications", (long) applicationService.count());
        return stats;
    }

    /**
     * 各职位分类的职位数量分布（饼图/柱图数据）
     */
    @GetMapping("/chart/category")
    @PermissionMeta(value = "分类分布统计")
    public List<Map<String, Object>> categoryChart() {
        List<CategoryDO> categories = categoryService.getAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (CategoryDO cat : categories) {
            QueryWrapper<PositionDO> wrapper = new QueryWrapper<>();
            wrapper.eq("category_id", cat.getId()).isNull("delete_time");
            long count = positionService.count(wrapper);
            if (count > 0) {
                Map<String, Object> item = new HashMap<>();
                item.put("name", cat.getName());
                item.put("value", count);
                result.add(item);
            }
        }
        return result;
    }

    /**
     * 各城市职位分布（条形图数据）
     */
    @GetMapping("/chart/city")
    @PermissionMeta(value = "城市分布统计")
    public List<Map<String, Object>> cityChart() {
        List<PositionDO> all = positionService.list(
            new QueryWrapper<PositionDO>().isNull("delete_time").eq("state", 1)
        );
        Map<String, Long> cityCount = all.stream()
            .filter(p -> p.getCity() != null && !p.getCity().isEmpty())
            .collect(Collectors.groupingBy(PositionDO::getCity, Collectors.counting()));

        return cityCount.entrySet().stream()
            .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
            .limit(10)
            .map(e -> {
                Map<String, Object> item = new HashMap<>();
                item.put("name", e.getKey());
                item.put("value", e.getValue());
                return item;
            })
            .collect(Collectors.toList());
    }

    /**
     * 投递状态漏斗图数据
     */
    @GetMapping("/chart/funnel")
    @PermissionMeta(value = "漏斗图统计")
    public List<Map<String, Object>> funnelChart() {
        long totalPositions = positionService.count(
            new QueryWrapper<PositionDO>().isNull("delete_time")
        );
        long totalApplications = applicationService.count();
        long interviewed = applicationService.count(
            new QueryWrapper<ApplicationDO>().eq("state", 2)
        );
        long pending = applicationService.count(
            new QueryWrapper<ApplicationDO>().eq("state", 0)
        );

        List<Map<String, Object>> result = new ArrayList<>();
        String[] names = {"发布职位", "收到投递", "进入面试", "待处理"};
        long[] values = {totalPositions, totalApplications, interviewed, pending};
        for (int i = 0; i < names.length; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", names[i]);
            item.put("value", values[i]);
            result.add(item);
        }
        return result;
    }

}
