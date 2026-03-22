package com.recruit.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import io.github.talelin.autoconfigure.exception.NotFoundException;
import io.github.talelin.core.annotation.GroupRequired;
import io.github.talelin.core.annotation.PermissionMeta;
import io.github.talelin.core.annotation.PermissionModule;
import com.recruit.model.CompanyDO;
import com.recruit.service.CompanyService;
import com.recruit.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.recruit.model.FollowDO;
import com.recruit.vo.CreatedVO;
import com.recruit.vo.DeletedVO;
import javax.validation.constraints.Positive;
import java.util.List;

/**
* @author Min
* @since 2022-03-31
*/
@RestController
@RequestMapping("/recruit/follow")
@PermissionModule(value = "关注公司")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private CompanyService companyService;

    /**
     * 添加关注
     * @return
     */
    @PostMapping("/add")
    @GroupRequired
    @PermissionMeta(value = "新增关注")
    public CreatedVO addFollow(@RequestBody FollowDO followDO) {
        // 查询是否已经关注过该公司
        FollowDO follow = find(followDO.getUserId(), followDO.getCompanyId());
        if (follow != null) {
            // 已经关注过该公司
            throw new NotFoundException(24000);
        }
        // 未关注过该公司，可以关注
        followService.create(followDO);

        // 关注成功，通知逻辑由 CompanyNotifyService 在职位发布/下架时触发
        return new CreatedVO(1100);
    }

    /**
     * 根据用户id和公司id取消关注该公司
     * @param userId
     * @param companyId
     * @return
     */
    @DeleteMapping("/cancel")
    @GroupRequired
    @PermissionMeta(value = "取消关注")
    public DeletedVO cancelFollow(@RequestParam @Positive(message = "{id.positive}") Integer userId, @RequestParam @Positive(message = "{id.positive}") Integer companyId) {
        followService.cancelFollow(userId, companyId);
        return new DeletedVO(1200);
    }

    /**
     * 根据用户id查询该用户的所有关注
     * @param userId
     * @return
     */
    @GetMapping("/{userId}")
    @GroupRequired
    @PermissionMeta(value = "查看我的关注")
    public List<CompanyDO> getAllByUserId(@PathVariable(value = "userId") @Positive(message = "{id.positive}") Integer userId) {
        List<CompanyDO> companyDOS = followService.getAllByUserId(userId);
        return companyDOS;
    }

    /**
     * 根据用户id和公司id查询关注，避免重复关注同一公司
     * @param userId
     * @return
     */
    @GetMapping("/find")
    public FollowDO find(@RequestParam Integer userId, @RequestParam Integer companyId) {
        QueryWrapper<FollowDO> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId).eq("company_id", companyId);
        FollowDO followDO = followService.getOne(wrapper);
        return followDO;
    }
}
