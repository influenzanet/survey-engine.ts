# Survey Definition Structure

## Overview

Usually a survey is described as a set of (ordered) questions. 

In this engine a survey is a hierarchical structure composed by 2 kind of elements:

- `SurveyItem`, can be a `SurveySingleItem` (one "question") or a `SurveyGroupItem` (one "group of questions)
- `SurveyItemComponent` hold by a `SurveySingleItem`, describing the question (see Components)

## SurveyItem

Survey items tree describes the survey organization, determining the way questions are presented and logically grouped.

Two kind of `SurveyItem:`

- `SurveySingleItem`, is the logical unit of the survey (usually known as "question"). It can show text, and/or data collection components with more or less complex layouts.
- `SurveyGroupItem` represents a group of SurveyItem(s)

Each kind of SurveyItem can react to rules of the survey (see Survey Engine Logic), so you can have a rule to show a single question (targeting a `SurveySingleItem`) or a group of questions (`SurveyGroupItem`)

An example of survey Structure will be (the key of item in parenthesis), levels represent the items of a group component

```yaml:
SurveyGroupItem(intake):
    - SurveySingleItem(intake.Q1)
    - SurveySingleItem(intake.Q2)
    - SurveyGroupItem(intake.HS)
        - SurveySingleItem(intake.HS.Q3)
        - SurveySingleItem(intake.HS.Q4)
```

### Path into the survey tree and key rules for SurveyItem

** Survey Engine Rule **

These rules are mandatory to allow the survey engine to work correctly.

Each `SurveyItem` has a key, uniquely identify the item inside the survey. 
They keys of SurveyItem elements (`SurveySingleItem` and `SurveyGroupItem`) must follow these rules:

- The key is composed by a set of segments separated by a dot (.), root element has only one segment
- The key segments are set of characters WITHOUT dot 
- The key of one SurveyItem must be prefixed by the key of it parents.
- All keys must uniquely identify one item 

The key with several segments separated by dots represent the path to this item from the root item. In other words, the key of each item must be the path (dot separated) to this item from the root item. Each dot represent the walk through the lower level. 

Examples:
 - A survey named weekly, with an item Q1:
   - The root item is is keyed 'weekly', 
   - the item is keyed 'weekly.Q1'
 - A survey named weekly with a group of question 'G1', this group containing two questions (SingleItem) Q1 and Q2:
   -  the root item's key is 'weekly'
   -  the group's key is 'weekly.G1'
   -  the item inside the groups have keys respectively 'weekly.G1.Q1', 'weekly.G1.Q2'

** General best practices **

- Key segments should be alphanumerical words, including underscores
- As meaningful as possible
- If a word separator is chosen (dash or underscore) it should be the same everywhere

** Best practices for InfluenzaNet **

Besides the previous naming rules, there are some naming convention, inherited from past platform of Influenzanet

- [should] Items are named with a 'Q' followed by a question identifier (in use Q[nn] and Qcov[nn])
- [must] Last segment of each key must be unique for all the survey. e.g. 'weekly.Q1' must be unique but also 'Q1' in the survey. You must not have another item with a key finishing by 'Q1', even if in another group. This rule because the last segment is used a the key for data export. 
- [must] Question keys are arbitrary but the common questions must have the assigned key in the survey standard definition 
- [should] Non common question, should have a prefix to clearly identify them as non standard question (like a namespace), for example 

## Survey Item Components

Components describe the properties of a SurveySingleItem (e.g. a question). 

Every elements of a question is a component with a specific role. For example the label, the input widget or an option is a component. 

Several kind of components are proposed :

- Display component, describing the visual parts of the question like texts (title, description, tooltip)
- Response component describing the data collection process
- Group component containing a list of components (the first level component of a `SurveySingleItem` is a Group component)

Components can also be described as a tree, nodes as Group components, and leaf with other kinds.

Each component has a 'role' field, giving the purpose of the component and how the survey engine will handle it.

Common roles:
- 'root' : the group component of a survey item, containing all the components of a Survey item.
- 'responseGroup' : a response group component
- 'helpGroup'
- 'text' : a component describing text to show (for example the label of the question)

Response dedicated roles:
- 'singleChoiceGroup'
- dropDownGroup
- multipleChoiceGroup
- dateInput
- input
- numberInput
- sliderNumeric, sliderNumericRange, sliderCategorical
- 'option' : component describing an option in a list of possible choices

common Fields :

- `content`, `description` : the visual/textual contents
- `displayCondition`: rules for displaying the component
- `properties`: properties to describes constraints and parameters of a component (like min/max value)
- `disabled` : rules for disabling component

For group component only
- `order` : order of components (for Group component)

Most of fields are represented as structure called `Expression`. They can be evaluated to a value (boolean, string, value) at runtime allowing to define complex rules to dynamically determine a field value.

### Keys

Component can also have keys uniquely identifying the component in the SurveyItem.

Keys are mandatory for Response component

## Expression

**Expression** are tree structures to represent operation to be evaluated at runtime and can produce a value. They provides dynamic property evaluation for the survey logic.

An **Expression** is a simple structure that can be either:
- A typed literal value (numerical, string)
- A call, with a `name` and a field `data` set of parameters with a list of `Expression`

## Survey Logic
