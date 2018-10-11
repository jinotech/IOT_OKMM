package com.okmindmap.util;

import java.util.ArrayList;

public class PagingHelper
{
  public static PagingHelper instance = new PagingHelper();
  
  private PagingHelper() { }
  
  //first: 처음, before: 이전, next: 다음, end: 끝
  public String autoPaging(long plTotalCnt, long plRowRange, long plPageRange, long plCurrPage, String first, String before, String next, String end, String delim)
  {
//    StringBuffer tsRetVal = new StringBuffer();
    if (plTotalCnt == 0L) {
      return "";
    }


    long plPageCnt = plTotalCnt % plRowRange;
    if (plPageCnt == 0L) {
      plPageCnt = plTotalCnt / plRowRange;
    }
    else {
      plPageCnt = plTotalCnt / plRowRange + 1L;
    }


//    tsRetVal.append("<table cellpadding=0 cellspacing=0 border=0 width=100%>");
//    tsRetVal.append("<tr>");
//    tsRetVal.append("<td aling=center style=\"border:0px solid\">");


    long plRangeCnt = plCurrPage / plPageRange;
    if (plCurrPage % plPageRange == 0L) {
      plRangeCnt = plCurrPage / plPageRange - 1L;
    }


    ArrayList<String> pages = new ArrayList<String>();
    long tlFirstPage = plCurrPage - plPageRange;
    if (tlFirstPage > 0) {
    	pages.add("<a href=\"javascript:goPage('1');\">" + first + "</a>");
//      tsRetVal.append("<a href=\"javascript:goPage('1');\">");
//      tsRetVal.append(first);
//      tsRetVal.append("</a>\n");
    } else {
    	pages.add(first);
//      tsRetVal.append(first);//비활성화 버튼 넣으면 됨
    }


    if (plCurrPage > plPageRange) {
      String s2;
      if (plCurrPage % plPageRange == 0L) {
        s2 = Long.toString(plCurrPage - plPageRange);
      } else {
        s2 = Long.toString(plCurrPage - plCurrPage % plPageRange);
      }
      pages.add("<a href=\"javascript:goPage('" + s2 + "');\">" + before + "</a>");
//      tsRetVal.append("<a href=\"javascript:goPage('").append(s2).append("');\">");
//      tsRetVal.append(before);
//      tsRetVal.append("</a>\n");
    } else {
    	pages.add(before);
//      tsRetVal.append(before);//비활성화 버튼 넣으면 됨
    }


    for (long index = plRangeCnt * plPageRange + 1L; index < (plRangeCnt + 1L) * plPageRange + 1L; index++) {
      String tsFontBegin = "";
      String tsFonfEnd = "";
      if (index == plCurrPage) {
        tsFontBegin = "<span class=\'nav_current_page\'>";
        tsFonfEnd = "</span>";
      }
      
      pages.add("<a href=\"javascript:goPage('" + Long.toString(index) + "');\">" + tsFontBegin + Long.toString(index) + tsFonfEnd + "</a>");
      //tsRetVal.append("<a href=\"javascript:goPage('").append(Long.toString(index)).append("');\">").append(tsFontBegin).append(Long.toString(index)).append(tsFonfEnd).append("</a>");
     // tsRetVal.;
      if (index == plPageCnt) {
        break;
      }
    }


    if (plPageCnt > (plRangeCnt + 1L) * plPageRange) {
    	pages.add("<a href=\"javascript:goPage('" + Long.toString((plRangeCnt + 1L) * plPageRange + 1L) + "');\" " + ">" + next + "</a>");
//      tsRetVal.append("<a href=\"javascript:goPage('").append(Long.toString((plRangeCnt + 1L) * plPageRange + 1L)).append("');\" ").append(">");
//      tsRetVal.append(next);
//      tsRetVal.append("</a>\n");
    } else {
    	pages.add(next);
//      tsRetVal.append(next);//비활성화 버튼 넣으면 됨
    }


    long tlEndPage = plCurrPage + plPageRange;
    if (tlEndPage < plPageCnt) {
    	pages.add("<a href=\"javascript:goPage('" + Long.toString(plPageCnt) + "');\" " + ">" + end + "</a>");
//      tsRetVal.append("<a href=\"javascript:goPage('").append(Long.toString(plPageCnt)).append("');\" ").append(">");
//      tsRetVal.append(end);
//      tsRetVal.append("</a>\n");
    } else {
    	pages.add(end);
//      tsRetVal.append(end);//비활성화 버튼 넣으면 됨
    }
    
    return ArrayUtil.join(pages, delim);
//    tsRetVal.append(ArrayUtil.join(pages, delim));
    
//    tsRetVal.append("</td></tr></table>");
    
//    return tsRetVal.toString();
  }


  public String autoPaging(long plTotalCnt, long plRowRange, long plPageRange, long plCurrPage)
  {
    return autoPaging(plTotalCnt, plRowRange, plPageRange, plCurrPage, " ◀◀ ", " ◁ ", " ▷ ", " ▶▶ ", "&nbsp;");
  }
}

