package org.durcframework.autocode.common;

import org.durcframework.core.SearchEntity;

/**
 * 专门为easyUI提供的查询类
 * 后面的查询类都要继承这个类
 * 2013年12月13日
 *
 */
public class SearchEasyUI extends SearchEntity {

	// 当前第几页
	private int page = 1;
	// 每页记录数
	private int rows = 10;

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.setPageIndex(page);
		this.page = page;
	}

	public int getRows() {
		return rows;
	}

	public void setRows(int rows) {
		this.setPageSize(rows);
		this.rows = rows;
	}

}
