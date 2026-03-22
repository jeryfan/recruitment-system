package com.recruit.controller;

import io.github.talelin.core.annotation.Logger;
import io.github.talelin.core.annotation.LoginRequired;
import com.recruit.bo.FileBO;
import com.recruit.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;

@RestController
public class FileController {

    @Autowired
    private FileService fileService;

    /**
     * 文件上传
     */
    @PostMapping("/recruit/file")
    @LoginRequired
    @Logger(template = "文件上传")
    public List<FileBO> upload(MultipartHttpServletRequest multipartHttpServletRequest) {
        MultiValueMap<String, MultipartFile> fileMap =
                multipartHttpServletRequest.getMultiFileMap();
        return fileService.upload(fileMap);
    }

    /**
     * Logo/图片上传（兼容前端 /recruit/upload/logo 调用）
     */
    @PostMapping("/recruit/upload/logo")
    @LoginRequired
    @Logger(template = "Logo上传")
    public List<FileBO> uploadLogo(MultipartHttpServletRequest multipartHttpServletRequest) {
        MultiValueMap<String, MultipartFile> fileMap =
                multipartHttpServletRequest.getMultiFileMap();
        return fileService.upload(fileMap);
    }
}
