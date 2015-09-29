/*
package tb.angularjs.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import tb.angularjs.model.UserSearch;
import tb.angularjs.repository.UserSearchRepository;

*/
/**
 * MainController class
 * 
 * @author netgloo
 *//*

@Controller
public class SearchController {

  // ------------------------
  // PRIVATE FIELDS
  // ------------------------

  // Inject the UserSearch object
  @Autowired
  private UserSearchRepository userSearch;


  // ------------------------
  // PUBLIC METHODS
  // ------------------------

  */
/**
   * Show search results for the given query.
   *
   * @param q The search query.
   *//*

  @RequestMapping("/search")
  public String search(String q, Model model) {
    List<UserSearch> searchResults = null;
    try {
      searchResults = userSearch.search(q);
    }
    catch (Exception ex) {
      // here you should handle unexpected errors
      // ...
      // throw ex;
    }
    model.addAttribute("searchResults", searchResults);
    return "search";
  }


} // class MainController
*/
