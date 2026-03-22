package com.recruit.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.recruit.model.FollowDO;
import com.recruit.model.NotifyDO;
import com.recruit.model.UserDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 公司通知服务：替代内存 Observer 模式，通过数据库 follow 表查询关注者并发送通知
 * 解决原有 SingleUtil.map / ObserverGenerate 在容器部署时无法工作的问题
 */
@Service
public class CompanyNotifyService {

    @Autowired
    private FollowService followService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotifyService notifyService;

    /**
     * 当公司发布新职位时，通知所有关注该公司的求职者
     *
     * @param companyId    公司ID
     * @param companyName  公司名称
     * @param positionName 职位名称
     */
    public void notifyFollowersOnPositionPublish(Integer companyId, String companyName, String positionName) {
        notifyFollowers(companyId, companyName + " 发布了新职位：" + positionName + "，快去看看吧！");
    }

    /**
     * 当公司下架职位时，通知所有关注该公司的求职者
     *
     * @param companyId    公司ID
     * @param companyName  公司名称
     * @param positionName 职位名称
     */
    public void notifyFollowersOnPositionRemove(Integer companyId, String companyName, String positionName) {
        notifyFollowers(companyId, companyName + " 已下架职位：" + positionName);
    }

    /**
     * 查询关注该公司的所有用户，并发送通知
     */
    private void notifyFollowers(Integer companyId, String content) {
        // 查询所有关注该公司的记录
        QueryWrapper<FollowDO> wrapper = new QueryWrapper<>();
        wrapper.eq("company_id", companyId);
        List<FollowDO> follows = followService.list(wrapper);

        if (follows == null || follows.isEmpty()) {
            return;
        }

        for (FollowDO follow : follows) {
            try {
                UserDO user = userService.getById(follow.getUserId());
                if (user != null) {
                    NotifyDO notifyDO = new NotifyDO();
                    notifyDO.setUserName(user.getUsername());
                    notifyDO.setContent(content);
                    notifyService.create(notifyDO);
                }
            } catch (Exception e) {
                // 单个通知失败不影响其他通知
            }
        }
    }
}
