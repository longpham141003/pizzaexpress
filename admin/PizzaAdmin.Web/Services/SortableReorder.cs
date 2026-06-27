using PizzaAdmin.Web.Models.Entities;

namespace PizzaAdmin.Web.Services;

public static class SortableReorder
{
    public static void Move<T>(List<T> items, int id, string direction) where T : ISortable
    {
        for (int i = 0; i < items.Count; i++) items[i].SortOrder = i;
        var idx = items.FindIndex(x => x.Id == id);
        if (idx < 0) return;
        var target = direction == "up" ? idx - 1 : idx + 1;
        if (target < 0 || target >= items.Count) return;
        (items[idx].SortOrder, items[target].SortOrder) = (items[target].SortOrder, items[idx].SortOrder);
    }

    public static void MoveTo<T>(List<T> items, int id, int position) where T : ISortable
    {
        var item = items.FirstOrDefault(x => x.Id == id);
        if (item == null) return;
        items.Remove(item);
        position = Math.Clamp(position, 0, items.Count);
        items.Insert(position, item);
        for (int i = 0; i < items.Count; i++) items[i].SortOrder = i;
    }
}
